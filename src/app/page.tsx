"use client";
import style from "./page.module.css";
import AudioPlayer from "@/components/AudioPlayer";
import { useState } from "react";
import TTS from "@/utils/TTS";
import { Button, ProgressBar, Stack } from "react-bootstrap";

export default function Home() {
  const [text, setText] = useState<string>("Hello. It's nice weather.");
  const [audio, setAudio] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("done");
  const [progress, setProgress] = useState<number>(0);
  const tts = new TTS();

  const onGenerate = async () => {
    setLoading(true);
    if (!tts.model) {
      await tts.loadInstance((now) => {
        setStatus(now.status);
        const progress: number = Math.floor((now.progress ?? 0) * 100) / 100;
        setProgress(progress);
      });
    }
    const audioBlob = await tts.generateAudioBlob(text);
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log(audioUrl);
      setAudio(audioUrl);
    }
    setLoading(false);
  }
  return (
    <main className={style.main}>
      <Stack gap={3}>
        <h1>Transformers.js</h1>
        <textarea placeholder="Enter text" value={text} onChange={(e) => setText(e.target.value)}></textarea>
        <Button onClick={onGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate'}</Button>
        {loading && <>
          <h3>Downloading model... {status}</h3>
          <ProgressBar now={progress} label={`${progress}%`} min={0} max={100}></ProgressBar>
        </>}
        {audio && <AudioPlayer audioUrl={audio} audioType="audio/wav" />}
      </Stack>
    </main>
  );
}
