import { GoogleGenerativeAI } from "@google/generative-ai";
import { Booking } from "../models/index.js";
import { encodeBase64 } from "bcryptjs";
import { response } from "express";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const tools = [
    {
        functionDeclarations : [
            {
                name : "createBooking",
                description : "create a room booking request for the user.",
                parameters : {
                    type : "OBJECT",
                    properties: {
                        roomId: {
                        type: "INTEGER",
                        description: "The ID of the room to book. (Assume room 1 if unspecified, or ask the user)",
                        },
                        title: {
                        type: "STRING",
                        description: "The title or name of the meeting/booking.",
                        },
                        purpose: {
                        type: "STRING",
                        description: "The purpose of the booking.",
                        },
                        participantCount: {
                        type: "INTEGER",
                        description: "Number of participants expected.",
                        },
                        startTime: {
                        type: "STRING",
                        description: "The start time of the booking in ISO 8601 format (e.g., 2026-07-15T10:00:00Z).",
                        },
                        endTime: {
                        type: "STRING",
                        description: "The end time of the booking in ISO 8601 format.",
                        },
          },
          required: ["roomId", "title", "startTime", "endTime"],
        },
      },
    ],
  },
];

export const generateRespond = async (prompt,userID) => { 
    try{
        // Initialize the model inside the function so it always gets the fresh current date
        const model = genAI.getGenerativeModel({
            model : "gemini-3.1-flash-lite",
            tools : tools,
            systemInstruction: `You are a helpful assistant. The current exact date and time is: ${new Date().toString()}. Please use this date to correctly calculate relative times like "tomorrow" or "next week".`
        });
        const chat = model.startChat();
        let result = await chat.sendMessage(prompt);
        let functionCalls = result.response.functionCalls();
        if(functionCalls&& functionCalls.length > 0){
            const call = functionCalls[0];
            if (call.name === 'createBooking') {
                const {roomId,title,purpose,participantCount,startTime,endTime} = call.args;
                try{
                    const newBooking = await Booking.create({
                        userId : userID,
                        roomId : roomId,
                        title : title,
                        purpose : purpose || "not specify.",
                        participantCount : participantCount || 1,
                        startTime : new Date(startTime),
                        endTime : new Date(endTime),
                        status : 'pending'
                    })
                    const functionResponse = [{
                        functionResponse : {
                            name : "createBooking",
                            response : {
                                success :true,
                                message : "booking created success.",
                                bookingId : newBooking.bookingId
                            }
                        }
                    }];
                    result = await chat.sendMessage(functionResponse);
                } catch (dbErr){
                    const errorResponse = [
                        {functionResponse : {
                            name : "createBooking",
                            response : {success : false, error : dbErr.message}
                        }}
                    ];
                    result = await chat.sendMessage(errorResponse);
                }
            }
        }
        return result.response.text();
    } catch (err){
        console.error("error gemini response", err);
        throw new Error('failed to generaet res');
    }
}



// export const generateRespond = async (prompt) => {
//     try{
//         const model = genAI.getGenerativeModel({model:"gemini-3.5-flash"});
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         return response.text();
//     } catch (err) {
//         console.error("error gemini response", err);
//         throw new Error("failed to generate response");
//     }
// }
