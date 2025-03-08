"use client"
import { useEffect, useRef } from "react";

export const Receiver = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'receiver' }));
        };

        const pc = new RTCPeerConnection();

        pc.ontrack = (event) => {
            console.log(event);
            if (videoRef.current) {
                videoRef.current.srcObject = new MediaStream([event.track]);
            }
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            if (message.type === 'createOffer') {
                pc.setRemoteDescription(message.sdp).then(() => {
                    pc.createAnswer().then((answer) => {
                        pc.setLocalDescription(answer);
                        socket.send(JSON.stringify({
                            type: 'createAnswer',
                            sdp: answer
                        }));
                    });
                });
            } else if (message.type === 'iceCandidate') {
                pc.addIceCandidate(message.candidate);
            }
        };

        return () => {
            socket.close();
            pc.close();
        };
    }, []);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => console.error("Autoplay blocked:", err));
        }
    };

    return (
        <div>
            <video ref={videoRef} autoPlay muted onClick={handlePlay} />
            <p>Click the video if autoplay doesn&apos;t work.</p>
        </div>
    );
};
