import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  let tempImagePath = '';
  
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const usePredefined = formData.get('usePredefined') === 'true';
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }
    
    console.log('Processing image:', image.name, 'Size:', image.size);
    
    // Save the uploaded image with original filename
    const buffer = Buffer.from(await image.arrayBuffer());
    const tempDir = path.join(process.cwd(), 'public', 'temp');
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    tempImagePath = path.join(tempDir, image.name);
    fs.writeFileSync(tempImagePath, buffer);
    
    // Run the prediction script with original filename
    const scriptPath = path.join(process.cwd(), 'ai-model', 'Prediction_Script.py');
    const modelDir = path.join(process.cwd(), 'ai-model', 'trained_model');
    
    console.log('Executing Python script:', scriptPath);
    const command = `python "${scriptPath}" "${tempImagePath}" --original_filename "${image.name}" --model_dir "${modelDir}" ${usePredefined ? '--use_predefined' : ''}`;
    console.log('Command:', command);
    
    const { stdout, stderr } = await execPromise(command);
    
    console.log('Python script stdout:', stdout);
    if (stderr) console.log('Python script stderr:', stderr);
    
    // Parse the output
    let result;
    try {
      // Try to find JSON content between curly braces if there's other text
      const jsonMatch = stdout.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(stdout.trim());
      }
      
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid output format from Python script');
      }
    } catch (parseError) {
      console.error('Error parsing prediction output:', parseError);
      console.error('Raw Python script output:', stdout);
      
      // Fallback result with error details
      return NextResponse.json({
        error: 'Failed to parse Python script output',
        location: 'Beluru',
        dynasty: 'Hoysala',
        style: 'Hoysala architecture',
        era: '12th century CE',
        caption: 'A beautiful Hoysala temple sculpture from Beluru, known for its intricate carvings and artistic excellence.',
        caption_source: 'Fallback (Error)'
      });
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process image',
        details: error instanceof Error ? error.stack : undefined,
        location: 'Beluru',
        dynasty: 'Hoysala',
        style: 'Hoysala architecture',
        era: '12th century CE',
        caption: 'A beautiful Hoysala temple sculpture from Beluru, known for its intricate carvings and artistic excellence.',
        caption_source: 'Fallback (Error)'
      }, 
      { status: 500 }
    );
  } finally {
    // Clean up
    if (tempImagePath && fs.existsSync(tempImagePath)) {
      try {
        fs.unlinkSync(tempImagePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file:', cleanupError);
      }
    }
  }
}