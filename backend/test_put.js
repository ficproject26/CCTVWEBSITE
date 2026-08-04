async function test() {
  const nextState = {
    orders: [
      {
        id: 'SK-ORD-82665',
        customer: 'moorthy',
        email: 'moorthy.antigraviity@gmail.com',
        phone: '8908908900',
        type: 'cctv1',
        location: 'Chennai Area',
        assignedTechnician: 'Kathiresan S',
        status: 'Approved',
        amount: 3000
      }
    ]
  };

  try {
    const response = await fetch('http://localhost:5000/api/dashboard', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nextState)
    });
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
