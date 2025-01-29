import fetch from 'node-fetch';

const testEvent = async () => {
  const payload = {
    category: "Porodicno stablo",
    fields: {
      famillyTree: "Djudja, Panta, Deda Milan, Deda Vesa, Baba Nina, Cika Ceda",
      email: "pantelyasm@gmail.com"
    }
  };
  
  console.log("Payload being sent:", JSON.stringify(payload));

  try {
    const response = await fetch("http://localhost:3000/api/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer cm63zfmlx00003a2b74mc9fr8",
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Response from processing event:", data);
  } catch (error) {
    console.error("Error:", error);
  }
};

testEvent();
