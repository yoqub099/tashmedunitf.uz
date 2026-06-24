<?php

namespace App\Observers;

use App\Services\AuditLogger;
use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * AUDIT OBSERVER — Generic (har qanday content modelга ulanadi)
 * ============================================================
 *
 * Model o'zgarishini activity_logs ga yozadi (ESKI → YANGI qiymat bilan).
 * AppServiceProvider'da ModelCacheObserver yonida ro'yxatdan o'tadi.
 *
 * `forceDeleted` ataylab implement qilinmagan — forceDelete() chaqirilganda
 * `deleted` ham ishlaydi (isForceDeleting() orqali ajratiladi), shuning uchun
 * bitta o'chirish = bitta jurnal yozuvi (ikki marta emas).
 * ============================================================
 */
class AuditObserver
{
    public function created(Model $model): void
    {
        AuditLogger::logModel('created', $model, null, $model->getAttributes());
    }

    public function updated(Model $model): void
    {
        $changed = $model->getChanges();   // faqat o'zgargan (yangi) qiymatlar

        // Faqat updated_at o'zgargan bo'lsa — mazmunli o'zgarish yo'q, e'tiborsiz
        $meaningful = array_diff_key($changed, array_flip(['updated_at']));
        if (empty($meaningful)) {
            return;
        }

        $old = array_intersect_key($model->getOriginal(), $changed);

        AuditLogger::logModel('updated', $model, $old, $changed);
    }

    public function deleted(Model $model): void
    {
        $event = method_exists($model, 'isForceDeleting') && $model->isForceDeleting()
            ? 'force_deleted'
            : 'deleted';

        AuditLogger::logModel($event, $model, $model->getAttributes(), null);
    }

    public function restored(Model $model): void
    {
        AuditLogger::logModel('restored', $model, null, $model->getAttributes());
    }
}
