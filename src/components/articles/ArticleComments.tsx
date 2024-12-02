'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Comment, useArticleComments } from '@/hooks/useArticleComments';
import styled from 'styled-components';
import { getImageUrl } from '@/services/api';
import { USER_PROFILE_AVATAR } from '@/constants/ui';
import { FiEdit2, FiTrash2, FiCornerUpLeft } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import AddFriendsModal from '@/components/user/AddFriendsModal';
import Modal from '@/components/ui/Modal';
import { GoPersonAdd } from 'react-icons/go';

const CommentsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  background-color: var(--foreground);
  display: flex;
  justify-content: center;
`;

const CommentsSection = styled.div`
  max-width: 900px;
  padding: 1.5rem;
  margin-bottom: 3rem;
  width: 100%;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  background-color: white;
  border: 1px solid #e0e0e0;
  color: #333;
  resize: vertical;
  min-height: 6rem;
  outline: none;

  &:focus {
    border-color: var(--app-yellow);
    box-shadow: 0 0 0 2px var(--app-yellow);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SendButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentItem = styled.div`
  padding: 1rem;
  background-color: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &.highlight {
    background-color: rgba(255, 198, 0, 0.1);
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: bold;
  color: #333;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  opacity: 0.7;
  font-size: 1.1rem;
  padding: 0.2rem;
  
  &:hover {
    opacity: 1;
    color: #333;
  }
`;

const CommentContent = styled.p`
  margin: 0;
  white-space: pre-wrap;
  color: #333;
`;

const CommentDate = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CommentsHeader = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--grey);
`;

const ReplyContainer = styled.div`
  margin-left: 1rem;
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid #e0e0e0;
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: var(--grey);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    color: var(--mid-grey);
  }
`;

const AddFriendButton = styled.button`
  background: none;
  border: none;
  color: var(--grey);
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  
  &:hover {
    color: var(--mid-grey);
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

const OnlineIndicator = styled.div<{ $isOnline: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$isOnline ? '#44b700' : '#ccc'};
  border: 2px solid white;
`;

interface ArticleCommentsProps {
    articleId: string;
}

const ArticleComments: React.FC<ArticleCommentsProps> = ({ articleId }) => {
    const { isAuthenticated, user } = useAuth();
    const { comments, loading, fetchComments, createComment, updateComment, deleteComment, replyToComment } = useArticleComments();
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        fetchComments(articleId);
    }, [articleId, fetchComments]);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#comment-')) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight');
                    setTimeout(() => {
                        const elementStillExists = document.querySelector(hash);
                        if (elementStillExists) {
                            elementStillExists.classList.remove('highlight');
                        }
                    }, 2000);
                }
            }, 500);
        }
    }, [comments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await createComment(articleId, { content: newComment.trim() });
            setNewComment('');
            fetchComments(articleId);
        } catch (error) {
            console.error('Error al crear el comentario:', error);
        }
    };

    const handleEdit = async (commentId: string) => {
        if (!editContent.trim()) return;

        try {
            await updateComment(commentId, { content: editContent.trim() });
            setEditingComment(null);
            fetchComments(articleId);
        } catch (error) {
            console.error('Error al actualizar el comentario:', error);
        }
    };

    const handleDeleteClick = (commentId: string) => {
        setCommentToDelete(commentId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (commentToDelete) {
            try {
                await deleteComment(commentToDelete);
                fetchComments(articleId);
            } catch (error) {
                console.error('Error al eliminar el comentario:', error);
            }
        }
        setIsDeleteModalOpen(false);
        setCommentToDelete(null);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setCommentToDelete(null);
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setEditContent('');
    };

    const handleReply = async (commentId: string) => {
        if (!replyContent.trim()) return;

        try {
            await replyToComment(commentId, { content: replyContent.trim() });
            setReplyContent('');
            setReplyingTo(null);
            fetchComments(articleId);
        } catch (error) {
            console.error('Error al responder al comentario:', error);
        }
    };

    const handleAddFriend = (userToAdd: any) => {
        setSelectedUser(userToAdd);
        setShowAddFriendModal(true);
    };

    const renderComment = (comment: Comment, isReply = false) => (
        <CommentItem key={comment.id} id={`comment-${comment.id}`}>
            <CommentHeader>
                <UserInfo>
                    <AvatarContainer>
                        <UserAvatar
                            src={comment.user.avatarPath ? getImageUrl(comment.user.avatarPath) : USER_PROFILE_AVATAR}
                            alt={comment.user.nik}
                        />
                        <OnlineIndicator $isOnline={comment.user.isOnline} />
                    </AvatarContainer>
                    <UserName>{comment.user.nik}</UserName>
                    {isAuthenticated &&
                        user?.id !== comment.user.id &&
                        !comment.user.isFriend &&
                        !comment.user.isPending && (
                            <AddFriendButton onClick={() => handleAddFriend(comment.user)}>
                                <GoPersonAdd />
                            </AddFriendButton>
                        )}
                    <CommentDate>
                        {new Date(comment.createdAt).toLocaleDateString()}
                        {comment.isEdited && ' (editado)'}
                    </CommentDate>
                </UserInfo>
                {user?.id === comment.user.id && (
                    <CommentActions>
                        <ActionButton onClick={() => {
                            setEditingComment(comment.id);
                            setEditContent(comment.content);
                        }}>
                            <FiEdit2 />
                        </ActionButton>
                        <ActionButton onClick={() => handleDeleteClick(comment.id.toString())}>
                            <FiTrash2 />
                        </ActionButton>
                    </CommentActions>
                )}
            </CommentHeader>
            {editingComment === comment.id ? (
                <CommentForm onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit(comment.id.toString());
                }}>
                    <CommentInput
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <ButtonContainer>
                        <Button
                            type="button"
                            onClick={handleCancelEdit}
                            $variant="cancel"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            $variant="primary"
                        >
                            Actualizar comentario
                        </Button>
                    </ButtonContainer>
                </CommentForm>
            ) : (
                <>
                    <CommentContent>{comment.content}</CommentContent>
                    {isAuthenticated && (
                        <ReplyButton onClick={() => setReplyingTo(comment.id)}>
                            <FiCornerUpLeft /> Responder
                        </ReplyButton>
                    )}
                </>
            )}

            {replyingTo === comment.id && (
                <CommentForm onSubmit={(e) => {
                    e.preventDefault();
                    handleReply(comment.id.toString());
                }}>
                    <CommentInput
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Escribe una respuesta..."
                    />
                    <ButtonContainer>
                        <Button
                            type="button"
                            onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                            }}
                            $variant="cancel"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            $variant="primary"
                            disabled={!replyContent.trim()}
                        >
                            Responder
                        </Button>
                    </ButtonContainer>
                </CommentForm>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <ReplyContainer>
                    {comment.replies.map(reply => renderComment(reply, true))}
                </ReplyContainer>
            )}
        </CommentItem>
    );

    return (
        <>
            <CommentsContainer>
                <CommentsSection>
                    <CommentsHeader>
                        {comments?.totalItems === 1
                            ? "1 Comentario"
                            : `${comments?.totalItems || 0} Comentarios`}
                    </CommentsHeader>

                    <CommentForm onSubmit={handleSubmit}>
                        <CommentInput
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={isAuthenticated ? "Escribe un comentario..." : "Inicia sesión para comentar"}
                            disabled={!isAuthenticated}
                        />
                        <SendButtonContainer>
                            <Button
                                type="submit"
                                disabled={!isAuthenticated || !newComment.trim()}
                                $variant="primary"
                            >
                                Publicar comentario
                            </Button>
                        </SendButtonContainer>
                    </CommentForm>

                    {loading ? (
                        <div>Cargando comentarios...</div>
                    ) : (
                        <CommentsList>
                            {comments?.comments
                                .filter(comment => !comment.parentId)
                                .map(comment => renderComment(comment))}
                        </CommentsList>
                    )}
                </CommentsSection>
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Eliminar comentario"
                    message="¿Estás seguro de que deseas eliminar este comentario?"
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    confirmVariant="danger"
                />
            </CommentsContainer>
            {showAddFriendModal && (
                <Modal
                    isOpen={showAddFriendModal}
                    onClose={() => {
                        setShowAddFriendModal(false);
                        setSelectedUser(null);
                    }}
                    title={`Añadir a ${selectedUser?.nik} a amigos`}
                    width="500px"
                >
                    <AddFriendsModal
                        onClose={() => {
                            setShowAddFriendModal(false);
                            setSelectedUser(null);
                        }}
                        initialUser={selectedUser}
                    />
                </Modal>
            )}
        </>
    );
};

export default ArticleComments; 