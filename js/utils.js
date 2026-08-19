// ===================================
// الصالحين - دوال مساعدة مشتركة
// ===================================

// ===== تنسيق العملة =====
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '0.00 ج.م';
  return new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' ج.م';
}

// ===== تنسيق التاريخ =====
export function formatDate(timestamp) {
  if (!timestamp) return '---';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatDateShort(timestamp) {
  if (!timestamp) return '---';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function formatDateTime(timestamp) {
  if (!timestamp) return '---';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// ===== الحصول على الحرف الأول للاسم =====
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return parts[0].substring(0, 2);
}

// ===== إشعارات Toast =====
let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 3500) {
  const container = ensureToastContainer();
  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ===== Loading Overlay =====
let loadingEl = null;

export function showLoading(message = 'جارٍ التحميل...') {
  if (!loadingEl) {
    loadingEl = document.createElement('div');
    loadingEl.className = 'loading-overlay';
    loadingEl.innerHTML = `<div class="loading-spinner"></div><p>${message}</p>`;
    document.body.appendChild(loadingEl);
  } else {
    loadingEl.querySelector('p').textContent = message;
    loadingEl.style.display = 'flex';
  }
}

export function hideLoading() {
  if (loadingEl) loadingEl.style.display = 'none';
}

// ===== Modal helper =====
export function openModal(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.classList.add('active');
}
export function closeModal(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.classList.remove('active');
}

// ===== تأكيد الحذف =====
export function confirmDelete(message = 'هل أنت متأكد من الحذف؟') {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal" style="max-width:400px">
        <div class="modal-body" style="text-align:center;padding:32px 24px">
          <div style="width:64px;height:64px;background:rgba(239,68,68,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.8rem;color:var(--danger)">
            <i class="fas fa-trash-alt"></i>
          </div>
          <h3 style="margin-bottom:8px;color:var(--primary)">تأكيد الحذف</h3>
          <p style="margin-bottom:24px;color:var(--text-secondary)">${message}</p>
          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-secondary" id="confirm-cancel-btn">إلغاء</button>
            <button class="btn btn-danger" id="confirm-delete-btn"><i class="fas fa-trash-alt"></i> حذف</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirm-delete-btn').onclick = () => { overlay.remove(); resolve(true); };
    overlay.querySelector('#confirm-cancel-btn').onclick = () => { overlay.remove(); resolve(false); };
  });
}

// ===== Debounce =====
export function debounce(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ===== التاريخ الحالي بصيغة input[type=date] =====
export function todayInputValue() {
  return new Date().toISOString().split('T')[0];
}

// ===== اليوم والتاريخ بالعربي =====
export function getArabicDate() {
  return new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
}

// ===== الرقم من string آمن =====
export function toNumber(val) {
  const n = parseFloat(String(val).replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

// ===== تصدير PDF بسيط =====
export function printSection(selector, title) {
  const content = document.querySelector(selector);
  if (!content) return;
  const w = window.open('', '_blank');
  w.document.write(`
    <html dir="rtl"><head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
      body { font-family: 'Cairo', sans-serif; padding: 24px; direction: rtl; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: right; }
      th { background: #0F1F3D; color: white; }
      h1 { color: #0F1F3D; margin-bottom: 20px; }
      .no-print { display: none; }
    </style>
    </head><body>
    <h1>${title}</h1>
    ${content.innerHTML}
    </body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 500);
}
