/**
 * Razorpay Payment Link Integration (Frontend-Only)
 * No backend required: open a Payment Link URL in a new tab.
 * Create your link at: Razorpay Dashboard → Payment Links → Create
 * Set your link below or in HTML: data-razorpay-payment-link="https://rzp.io/i/xxxxx"
 */
(function () {
  'use strict';

  // Replace with your Razorpay Payment Link from Dashboard (Payment Links → Create)
  window.RAZORPAY_CONFIG = window.RAZORPAY_CONFIG || {
    paymentLink: '' // e.g. 'https://rzp.io/i/xxxxxxxx'
  };

  function getPaymentLink() {
    var container = document.querySelector('[data-razorpay-payment-link]');
    if (container && container.getAttribute('data-razorpay-payment-link')) {
      return container.getAttribute('data-razorpay-payment-link').trim();
    }
    return (window.RAZORPAY_CONFIG && window.RAZORPAY_CONFIG.paymentLink) ? window.RAZORPAY_CONFIG.paymentLink : '';
  }

  function openRazorpayPayment(ev) {
    if (ev) ev.preventDefault();
    var link = getPaymentLink();
    if (!link) {
      alert('Payment link is not configured. Please add your Razorpay Payment Link in razorpay-integration.js (RAZORPAY_CONFIG.paymentLink) or set data-razorpay-payment-link on the button container.');
      return;
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-pay-razorpay, [data-razorpay-open]').forEach(function (btn) {
      btn.addEventListener('click', openRazorpayPayment);
    });
  });

  window.openRazorpayPayment = openRazorpayPayment;
})();
