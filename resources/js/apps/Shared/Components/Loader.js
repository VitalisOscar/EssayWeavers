import React from 'react';

export default function Loader() {
    return (
        <div className="d-flex justify-content-center">
            <div className="loader rounded">
                <div className="progress-background rounded"></div>

                <div className="progress-box">
                    <div className="spinner-border text-primary"></div>
                </div>
            </div>
        </div>
    );
}
