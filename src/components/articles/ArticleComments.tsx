'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useArticleComments } from '@/hooks/useArticleComments';
import styled from 'styled-components';
import { getImageUrl } from '@/services/api';
import { USER_PROFILE_AVATAR } from '@/constants/ui';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

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

const LoginMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 1rem;
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

interface ArticleCommentsProps {
    articleId: string;
}

const ArticleComments: React.FC<ArticleCommentsProps> = ({ articleId }) => {
    const { isAuthenticated, user } = useAuth();
    const { comments, loading, fetchComments, createComment, updateComment, deleteComment } = useArticleComments();
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchComments(articleId);
    }, [articleId, fetchComments]);

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

    return (
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
                        {comments?.comments.map((comment) => (
                            <CommentItem key={comment.id}>
                                <CommentHeader>
                                    <UserInfo>
                                        <UserAvatar
                                            src={comment.user.avatarPath ? getImageUrl(comment.user.avatarPath) : USER_PROFILE_AVATAR}
                                            alt={comment.user.nik}
                                        />
                                        <UserName>{comment.user.nik}</UserName>
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
                                    <CommentContent>{comment.content}</CommentContent>
                                )}
                            </CommentItem>
                        ))}
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
    );
};

export default ArticleComments; 