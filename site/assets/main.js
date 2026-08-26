// Shared functions for WhatsApp-first booking and enquiry form
const AGENT_PHONE = '254753753266'; // 0753753266 → 254753753266 (Kenya, no +)
const AGENT_EMAIL = 'agent@example.com';

function openWhatsAppMessage(message){
  const url = `https://wa.me/${AGENT_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// wire up search on home
document.addEventListener('DOMContentLoaded', ()=>{
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
    waLink.href = `https://wa.me/${AGENT_PHONE}`;
  }

  // booking form page
  const bookingForm = document.getElementById('bookingForm');
  if(bookingForm){
    document.getElementById('openWhatsApp').addEventListener('click', ()=>{
      const data = new FormData(bookingForm);
      const msg = `Hi Trinity Express, I want to book from ${data.get('origin')} to ${data.get('destination')} on ${data.get('date')}. Passengers: ${data.get('passengers')}. Name: ${data.get('name')}, Phone: ${data.get('phone')}`;
      openWhatsAppMessage(msg);
    });

    bookingForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const body = Object.fromEntries(new FormData(bookingForm).entries());
      try{
        const res = await fetch('/.netlify/functions/enquiry',{
          method:'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(body)
        });
        if(res.ok){ window.location='/site/thank-you.html'; }
        else { alert('Could not send enquiry, please WhatsApp or call the agent.'); }
      }catch(err){
        alert('Network error - please WhatsApp or call the agent.');
      }
    });
  }

  // charter form
  const charter = document.getElementById('charterRequest');
  if(charter){
    document.getElementById('charterWhatsApp')?.addEventListener('click', (ev)=>{
      ev.preventDefault();
      const msg = `Hi Trinity Express, I want a chartered bus. Please advise.`;
      openWhatsAppMessage(msg);
    });

    document.getElementById('charterSendWA')?.addEventListener('click', ()=>{
      const data = new FormData(charter);
      const msg = `Hi Trinity Express, Charter request: ${data.get('route')} on ${data.get('date')}. Passengers: ${data.get('passengers')}. Name: ${data.get('name')}. Phone: ${data.get('phone')}`;
      openWhatsAppMessage(msg);
    });

    charter.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const body = Object.fromEntries(new FormData(charter).entries());
      try{
        const res = await fetch('/.netlify/functions/enquiry',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({...body, type:'charter'})
        });
        if(res.ok) window.location='/site/thank-you.html';
        else alert('Could not send charter request - please WhatsApp or call.');
      }catch(err){ alert('Network error - please WhatsApp or call.'); }
    });
  }
});
