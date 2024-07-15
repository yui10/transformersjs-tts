import { env, pipeline, TextToAudioPipeline } from '@xenova/transformers';
import { WaveFile } from 'wavefile';
env.allowRemoteModels = true;
env.allowLocalModels = false;

class TTS {
    static BASE_URL = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin';

    model: TextToAudioPipeline | null = null;

    loadInstance = async (progress_callback: (progress: any) => void) => {
        this.model = await pipeline('text-to-speech', 'Xenova/speecht5_tts',
            {
                quantized: false,
                progress_callback: progress_callback
            });
        console.log('Model loaded');
    }

    generateAudioData = async (text: string) => {
        if (!this.model) {
            return null;
        }

        const audio = await this.model(text, { speaker_embeddings: TTS.BASE_URL });
        console.log(audio);
        return audio;
    }

    generateAudioBlob = async (text: string) => {
        const result = await this.generateAudioData(text);
        if (!result) return null;
        console.log(result);
        const wav = new WaveFile();
        wav.fromScratch(1, result.sampling_rate, '32f', result.audio);
        const blob = new Blob([wav.toBuffer()], { type: 'audio/wav' });
        return blob;
    }
}
export default TTS;
