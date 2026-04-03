const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
require('dotenv').config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Apex Digital.html');
});

app.post('/api/submit-form', async (req, res) => {
  const { businessName, email, businessGoals } = req.body;

  if (!businessName || !email || !businessGoals) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'apexdigital2002@gmail.com',
      subject: `New Lead: ${businessName}`,
      html: `
        <h2>New Business Growth Audit Request</h2>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Business Goals:</strong></p>
        <p>${businessGoals.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.json({ success: true, message: 'Enquiry submitted successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
