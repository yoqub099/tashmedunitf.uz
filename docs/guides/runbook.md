# Production Runbook

> Operational playbook for production incidents.
> Read this **before** an incident, not during.

## On-call contacts

| Role | Primary | Backup |
|------|---------|--------|
| Tech Lead | TBD | TBD |
| DevOps | TBD | TBD |
| DBA | TBD | TBD |

## Quick links

| What | URL |
|------|-----|
| Production site | https://tashmedunitf.uz |
| Admin panel | https://admin.tashmedunitf.uz |
| API health | https://api.tashmedunitf.uz/api/health |
| Monitoring (Grafana) | TBD |
| Error tracking (Sentry) | TBD |
| CI/CD (GitHub Actions) | https://github.com/tmtu-termiz/monorepo/actions |

## Common incidents

### Site is down (5xx errors)

1. Check API health endpoint:
   ```bash
   curl -i https://api.tashmedunitf.uz/api/health
   ```
2. SSH to server, check container status:
   ```bash
   docker compose -f infrastructure/docker/compose/compose.yml ps
   ```
3. Check API logs:
   ```bash
   docker compose -f infrastructure/docker/compose/compose.yml logs --tail=200 app
   ```
4. Common causes:
   - **Database down** → restart `postgres` container, check disk space
   - **Redis down** → restart `redis` container
   - **PHP-FPM crash** → restart `app` container, check `app_logs` volume
   - **Out of memory** → check `docker stats`, scale up if needed

### High latency

1. Check Grafana dashboards (TBD)
2. Top suspects:
   - **DB slow queries** → enable `log_min_duration_statement = 100` in postgres
   - **Cache miss storm** → check Redis hit ratio: `redis-cli INFO stats`
   - **N+1 queries** → enable Laravel Debugbar in staging, find the offender

### Admin can't login

1. Check admin container logs:
   ```bash
   docker compose logs --tail=100 admin
   ```
2. Check API auth endpoint:
   ```bash
   curl -X POST https://api.tashmedunitf.uz/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@tdtutf.uz","password":"..."}'
   ```
3. If user is locked out (5 failed attempts → 15min lockout):
   ```bash
   docker compose exec app php artisan tinker
   > Cache::forget('login.lockout:admin@tdtutf.uz')
   ```

### Failed deployment

1. Check GitHub Actions run for the failure step
2. If migration failed:
   ```bash
   docker compose exec app php artisan migrate:status
   docker compose exec app php artisan migrate:rollback --step=1
   ```
3. If build cache is poisoned:
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```
4. Last resort — roll back to previous git tag:
   ```bash
   git checkout v1.2.3
   ./scripts/deploy.sh docker
   ```

### Database disk full

1. Check disk usage:
   ```bash
   df -h
   docker exec tmtu_postgres df -h
   ```
2. Free space:
   - Truncate old logs: `truncate -s 0 logs/*.log`
   - Old backups: `find /backups -name "db-*.sql.gz" -mtime +30 -delete`
   - Vacuum DB: `docker exec tmtu_postgres psql -U postgres -d tmtu_termiz -c "VACUUM FULL;"`

### Media files missing (404 on images)

1. Verify symlink:
   ```bash
   docker compose exec app ls -la /var/www/html/public/storage
   ```
2. Re-link:
   ```bash
   docker compose exec app php artisan storage:link
   ```
3. Check media volume:
   ```bash
   docker volume inspect tmtu_app_storage
   ```

## Routine operations

### Daily backup (cron at 03:00)

```bash
0 3 * * * /var/www/tmtu-termiz/scripts/backup.sh
```

Verify backup:
```bash
ls -lh /backups/db-*.sql.gz | tail -7
```

### Weekly tasks

- Review error tracking (Sentry) for new exceptions
- Review Grafana alerts that fired
- Check disk usage trend
- Review CI failure rate

### Monthly tasks

- Rotate API tokens
- Review user access (admin accounts)
- Apply security patches (`docker compose pull && docker compose up -d`)
- Restore-test the latest backup (in staging)

### Quarterly tasks

- Rotate database password
- Rotate Redis password
- Audit GitHub Secrets
- Review CODEOWNERS

## Emergency contacts

- **Hosting provider:** TBD
- **Domain registrar:** TBD
- **DDoS mitigation:** Cloudflare (TBD)
- **University IT:** TBD

## Escalation matrix

| Severity | Response time | Notify |
|----------|---------------|--------|
| P0 (site down) | 15 min | Tech lead + DevOps + university IT |
| P1 (degraded) | 1 hour | Tech lead + DevOps |
| P2 (single feature broken) | 4 hours | Tech lead |
| P3 (minor) | Next business day | — |
