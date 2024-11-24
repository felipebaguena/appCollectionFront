'use client';

import FriendProfile from '@/components/friends/FriendProfile';

export default function FriendProfilePage({ params }: { params: { id: string } }) {
    return <FriendProfile id={params.id} />;
}
