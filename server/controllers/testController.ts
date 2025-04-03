import { Request, Response } from 'express';
import Test from '../models/Test';

export const createTest = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const test = new Test({ name });
    const savedTest = await test.save();
    res.status(201).json(savedTest);
  } catch (error) {
    res.status(400).json({ message: 'Error creating test', error });
  }
};

export const getAllTests = async (req: Request, res: Response) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests', error });
  }
}; 