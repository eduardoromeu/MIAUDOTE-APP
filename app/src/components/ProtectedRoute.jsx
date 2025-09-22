import React from 'react';

// The imports are correct, no changes needed here
import { Navigate, Outlet, useOutletContext } from 'react-router';

export default function ProtectedRoute() {
    // Get the entire context object from the parent (root.jsx)
    const context = useOutletContext();
    const { user } = context;

    // This part is still correct: if no user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // THE FIX: Pass the context along to the child route (Profile.jsx)
    return <Outlet context={context} />;
}