import React from 'react';
import { Skeleton, SkeletonText } from '../common/Skeleton';

const DashboardSkeleton = ({ type = 'overview' }) => {
  const renderOverviewSkeleton = () => (
    <div className="row g-4">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card h-100">
          <div className="card-body">
            <Skeleton width="60%" height="1.5rem" className="mb-3" />
            <SkeletonText lines={3} />
            <Skeleton width="40%" height="2rem" className="mt-3" />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card h-100">
          <div className="card-body">
            <Skeleton width="70%" height="1.5rem" className="mb-3" />
            <SkeletonText lines={4} />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card h-100">
          <div className="card-body">
            <Skeleton width="50%" height="1.5rem" className="mb-3" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointmentsSkeleton = () => (
    <div className="card">
      <div className="card-body">
        <Skeleton width="40%" height="1.75rem" className="mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-bottom pb-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Skeleton width="30%" height="1.25rem" />
              <Skeleton width="15%" height="1.25rem" />
            </div>
            <SkeletonText lines={2} className="mb-2" />
            <Skeleton width="25%" height="1.25rem" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessagesSkeleton = () => (
    <div className="card">
      <div className="card-body">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="d-flex gap-3 py-3 border-bottom">
            <Skeleton width="48px" height="48px" circle />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between mb-1">
                <Skeleton width="30%" height="1.25rem" />
                <Skeleton width="15%" height="1rem" />
              </div>
              <Skeleton width="70%" height="1rem" className="mb-1" />
              <Skeleton width="90%" height="0.875rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResultsSkeleton = () => (
    <div className="row g-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="col-12 col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <Skeleton width="60%" height="1.5rem" className="mb-3" />
              <SkeletonText lines={2} className="mb-3" />
              <div className="d-flex justify-content-between align-items-center">
                <Skeleton width="40%" height="1.25rem" />
                <Skeleton width="30%" height="2rem" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNearbySkeleton = () => (
    <div className="row">
      <div className="col-12 col-lg-5 mb-4 mb-lg-0">
        <div className="card h-100">
          <div className="card-body">
            <Skeleton width="50%" height="1.75rem" className="mb-4" />
            <div className="list-group">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="list-group-item border-0 px-0 py-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Skeleton width="60%" height="1.25rem" />
                    <Skeleton width="15%" height="1rem" />
                  </div>
                  <Skeleton width="80%" height="0.875rem" className="mb-2" />
                  <Skeleton width="40%" height="0.875rem" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-7">
        <div className="card h-100">
          <div className="card-body p-0">
            <Skeleton height="400px" className="w-100" />
          </div>
        </div>
      </div>
    </div>
  );

  const skeletonMap = {
    overview: renderOverviewSkeleton(),
    appointments: renderAppointmentsSkeleton(),
    messages: renderMessagesSkeleton(),
    results: renderResultsSkeleton(),
    nearby: renderNearbySkeleton(),
  };

  return (
    <div className="skeleton-container">
      {skeletonMap[type] || skeletonMap.overview}
    </div>
  );
};

export default DashboardSkeleton;
