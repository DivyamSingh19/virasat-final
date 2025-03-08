"use client"
import { useEffect, useRef } from "react";

export const Receiver = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log("WebSocket connected");
            socket.send(JSON.stringify({ type: 'receiver' }));
        };

        const pc = new RTCPeerConnection();

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.send(JSON.stringify({
                    type: 'iceCandidate',
                    candidate: event.candidate
                }));
            }
        };

        pc.ontrack = (event) => {
            console.log("Track received:", event);
            if (videoRef.current) {
                videoRef.current.srcObject = event.streams[0];
            }
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received message:", message);
            
            if (message.type === 'createOffer') {
                pc.setRemoteDescription(new RTCSessionDescription(message.sdp)).then(() => {
                    pc.createAnswer().then((answer) => {
                        pc.setLocalDescription(answer);
                        socket.send(JSON.stringify({
                            type: 'createAnswer',
                            sdp: answer
                        }));
                    });
                });
            } else if (message.type === 'iceCandidate') {
                pc.addIceCandidate(new RTCIceCandidate(message.candidate));
            }
        };

        return () => {
            socket.close();
            pc.close();
        };
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline controls width="640" height="480" />
        </div>
    );
};