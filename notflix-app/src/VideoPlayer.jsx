
import React from 'react';

const VideoPlayer = () => {
    return (
        <div className="video-player-container">
            <h2>Video Stream</h2>
            <video
                controls
                width="800"
                src="/video"
                crossOrigin="anonymous" // Important for handling CORS if needed for captions etc, though src usually doesn't need it for playback unless we do canvas manipulation.
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
