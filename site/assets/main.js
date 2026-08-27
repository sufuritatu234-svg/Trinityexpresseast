// Shared functions for WhatsApp-first booking and enquiry form
const AGENT_PHONE = '254753753266'; // 0753753266 → 254753753266 (Kenya, no +)
const AGENT_EMAIL = 'jameskesteve@gmail.com';

function openWhatsAppMessage(message){
  const url = `https://wa.me/${AGENT_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
function openPhone(){
  window.location = `tel:+${AGENT_PHONE}`;
}
function openEmail(){
  window.location = `mailto:${AGENT_EMAIL}`;
}

// Create floating action button (FAB)
function createFAB(){
  if(document.getElementById('site-fab')) return;
  const fab = document.createElement('div');
  fab.id = 'site-fab';
  fab.className = 'fab';

  const button = document.createElement('button');
  button.className = 'fab-button';
  button.title = 'Contact Trinity Express';
  button.innerText = '☏';

  const menu = document.createElement('div');
  menu.className = 'fab-menu';
  menu.style.display = 'none';

  const wa = document.createElement('a');
  wa.href = `https://wa.me/${AGENT_PHONE}?text=${encodeURIComponent('Hello Trinity Express, I would like to book')}`;
  wa.target = '_blank';
  wa.className = 'fab-item';
  wa.innerHTML = `<span>WhatsApp</span><span class="label">+254 753 753 266</span>`;

  const call = document.createElement('a');
  call.href = `tel:+254753753266`;
  call.className = 'fab-item';
  call.innerHTML = `<span>Call</span><span class="label">+254 753 753 266</span>`;

  const email = document.createElement('a');
  email.href = `mailto:${AGENT_EMAIL}`;
  email.className = 'fab-item';
  email.innerHTML = `<span>Email</span><span class="label">${AGENT_EMAIL}</span>`;

  menu.appendChild(wa);
  menu.appendChild(call);
  menu.appendChild(email);

  button.addEventListener('click', (e)=>{
    e.stopPropagation();
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });

  // close menu when clicking outside
  document.addEventListener('click', ()=>{ menu.style.display = 'none'; });
  menu.addEventListener('click', (e)=>{ e.stopPropagation(); });

  fab.appendChild(button);
  fab.appendChild(menu);
  document.body.appendChild(fab);
}

// wire up search on home
document.addEventListener('DOMContentLoaded', ()=>{
  createFAB();

  const go = document.getElementById('goSearch');
  if(go){
    go.addEventListener('click', ()=>{
      const origin = document.getElementById('origin').value || '';
      const destination = document.getElementById('destination').value || '';
      const date = document.getElementById('date').value || '';
      // naive client-side navigation to search page with params
      const q = new URLSearchParams({origin,destination,date}).toString();
      window.location = '/site/search.html?'+q;
    });
  }

  // book buttons across pages
  document.querySelectorAll('.bookNow').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const trip = btn.dataset.trip || '';
      const date = btn.dataset.date || '';
      const msg = `Hi Trinity Express, I want to book ${trip} ${date ? 'on '+date : ''}. Please advise. Name:`;
      openWhatsAppMessage(msg);
    });
  });

  // contact page WA link
  const waLink = document.getElementById('waLink');
  if(waLink){
    waLink.href = `https://wa.me/${AGENT_PHONE}?text=${encodeURIComponent('Hello Trinity Express, I would like to book or make a payment')}`;
  }

  // booking form page — open WhatsApp instead of submitting to serverless function
  const bookingForm = document.getElementById('bookingForm');
  if(bookingForm){
    document.getElementById('openWhatsApp')?.addEventListener('click', ()=>{
      const data = new FormData(bookingForm);
      const msg = `Hi Trinity Express, I want to book from ${data.get('origin')} to ${data.get('destination')} on ${data.get('date')}. Passengers: ${data.get('passengers')}. Name: ${data.get('name')}. Phone: ${data.get('phone') || ''}`;
      openWhatsAppMessage(msg);
    });

    bookingForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = new FormData(bookingForm);
      const msg = `Hi Trinity Express, I want to book from ${data.get('origin')} to ${data.get('destination')} on ${data.get('date')}. Passengers: ${data.get('passengers')}. Name: ${data.get('name')}. Phone: ${data.get('phone') || ''}`;
      openWhatsAppMessage(msg);
    });
  }

  // charter form — same behaviour: open WhatsApp
  const charter = document.getElementById('charterRequest');
  if(charter){
    document.getElementById('charterWhatsApp')?.addEventListener('click', (ev)=>{
      ev.preventDefault();
      const msg = `Hi Trinity Express, I want a chartered bus. Please advise. Name:`;
      openWhatsAppMessage(msg);
    });

    document.getElementById('charterSendWA')?.addEventListener('click', ()=>{
      const data = new FormData(charter);
      const msg = `Hi Trinity Express, Charter request: ${data.get('route')} on ${data.get('date')}. Passengers: ${data.get('passengers')}. Name: ${data.get('name')}. Phone: ${data.get('phone') || ''}`;
      openWhatsAppMessage(msg);
    });

    charter.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = new FormData(charter);
      const msg = `Hi Trinity Express, Charter request: ${data.get('route')} on ${data.get('date')}. Passengers: ${data.get('passengers')}. Name: ${data.get('name')}. Phone: ${data.get('phone') || ''}`;
      openWhatsAppMessage(msg);
    });
  }
});
