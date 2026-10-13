// const { GoogleGenAI, Type } = require('@google/genai');

// const ai = new GoogleGenAI(); // Environment variable se automatically key utha lega

//  async function categorizeExpense(description) {
//     console.log("generate function hit");
//   try {
//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: `Analyze this expense description and categorize it: "${description}"`,
//       config: {
//         // Strict JSON output enforce karne ke liye
//         responseMimeType: 'application/json',
//         responseSchema: {
//           type: Type.OBJECT,
//           properties: {
//             category: {
//               type: Type.STRING,
//               description: "The primary category of the expense (e.g., Food & Dining, Transport, Utilities, Shopping, Entertainment, Health, Rent, Groceries, Miscellaneous)."
//             },
//             confidence: {
//               type: Type.NUMBER,
//               description: "Confidence score between 0 and 1."
//             }
//           },
//           required: ["category"],
//         },
//         systemInstruction: "You are an AI assistant for an expense tracker. Classify the user's expense description into a clean, standard financial category."
//       }
//     });

//     // Parsed JSON response return karein
//     return JSON.parse(response.text);
//   } catch (error) {
//     console.error("AI Categorization Error:", error);
//     return { category: "Miscellaneous", confidence: 0 };
//   }
// }


// module.exports = {categorizeExpense}