/**
 * Server-rendered inline script that runs BEFORE React hydration to apply
 * stored a11y classes synchronously, preventing FOUC (flash of un-styled
 * content) when the user reloads with a non-default scheme active.
 *
 * Must be rendered inside <head> or as the first child of <body>.
 */
const SCRIPT = `(function(){try{var s=localStorage.getItem('tmtu:a11y');if(!s)return;var d=JSON.parse(s);if(!d||!d.enabled)return;var h=document.documentElement;h.classList.add('a11y-scheme-'+(d.scheme||'default'),'a11y-font-'+(d.fontFamily||'sans'),'a11y-fs-'+(d.fontSize||'medium'));h.setAttribute('data-a11y-images',d.imagesVisible===false?'hidden':'visible');h.setAttribute('data-a11y-pending','true');}catch(e){}})();`;

export default function A11yPreHydrationScript() {
  return (
    <script
      id="a11y-init"
      data-a11y-ui="true"
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
