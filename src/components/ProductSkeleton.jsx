import React from 'react';

export function ProductSkeleton() {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-img"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text-sm"></div>
            <div className="skeleton skeleton-text-sm" style={{ width: '40%' }}></div>
            <div className="skeleton skeleton-btn"></div>
        </div>
    );
}
