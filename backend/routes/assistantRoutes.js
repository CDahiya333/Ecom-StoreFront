// routes/assistantRoutes.js
import express from "express";
import { getModelResponse } from "../lib/modelCall.js";
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await getModelResponse(message);
    
    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error in assistant route:', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message
    });
  }
});

export default router;