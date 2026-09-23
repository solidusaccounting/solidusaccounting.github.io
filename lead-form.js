document.querySelectorAll('.lead-form').forEach((form) => {
  let pending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending) return;
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[role="status"]');
    const originalLabel = button.textContent;
    pending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    status.classList.remove('lead-error');
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Submission not accepted');
      form.reset();
      status.textContent = 'Thank you — your request has been received. Our team will respond within 2 business days.';
      // Analytics must never turn an accepted enquiry into an apparent failure.
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'manual_event_SUBMIT_LEAD_FORM');
        }
      } catch (analyticsError) {
        // The enquiry has already been accepted; keep its success message.
      }
    } catch (error) {
      status.classList.add('lead-error');
      status.textContent = 'We could not confirm delivery. Please try again or email contact@solidusaccounting.com. Your entries have been kept.';
    } finally {
      pending = false;
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
});
