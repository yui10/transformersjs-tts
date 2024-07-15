"use client";
import React, { useEffect } from 'react'
type AudioPlayerProps = {
    audioUrl: string
    audioType: string
}
const AudioPlayer = (props: AudioPlayerProps) => {
    const { audioUrl, audioType } = props;
    const audioPlayer = React.useRef<HTMLAudioElement>(null);
    const audioSource = React.useRef<HTMLSourceElement>(null);

    useEffect(() => {
        if (!audioPlayer.current || !audioSource.current) return;
        audioSource.current.src = audioUrl;
        audioPlayer.current.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioUrl]);
    return (
        <audio controls ref={audioPlayer}>
            <source ref={audioSource} type={audioType} />
        </audio>
    )
}

export default AudioPlayer
