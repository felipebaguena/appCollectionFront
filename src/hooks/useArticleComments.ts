"use client";

import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

export interface User {
  id: number;
  name: string;
  nik: string;
  avatarPath: string | null;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  parentId: number | null;
  user: User;
  replies: Comment[];
}

interface CommentsResponse {
  comments: Comment[];
  totalItems: number;
  totalPages: number;
}

interface CreateCommentData {
  content: string;
}

export const useArticleComments = () => {
  const [comments, setComments] = useState<CommentsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(
    async (articleId: string, page: number = 1, limit: number = 10) => {
      setLoading(true);
      try {
        const data = await api.get<CommentsResponse>(
          ENDPOINTS.GET_ARTICLE_COMMENTS(articleId, page, limit)
        );
        setComments(data);
        setError(null);
        return data;
      } catch (error) {
        setError("Error al cargar los comentarios");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createComment = useCallback(
    async (articleId: string, commentData: CreateCommentData) => {
      setLoading(true);
      try {
        const data = await api.post<Comment>(
          ENDPOINTS.CREATE_ARTICLE_COMMENT(articleId),
          commentData
        );
        setError(null);
        return data;
      } catch (error) {
        setError("Error al crear el comentario");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateComment = useCallback(
    async (commentId: string, commentData: CreateCommentData) => {
      setLoading(true);
      try {
        const data = await api.put<Comment>(
          ENDPOINTS.UPDATE_ARTICLE_COMMENT(commentId),
          commentId,
          commentData
        );
        setError(null);
        return data;
      } catch (error) {
        setError("Error al actualizar el comentario");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteComment = useCallback(async (commentId: string) => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.DELETE_ARTICLE_COMMENT(commentId), commentId);
      setError(null);
      return true;
    } catch (error) {
      setError("Error al eliminar el comentario");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const replyToComment = useCallback(
    async (commentId: string, commentData: CreateCommentData) => {
      setLoading(true);
      try {
        const data = await api.post<Comment>(
          ENDPOINTS.REPLY_TO_COMMENT(commentId),
          commentData
        );
        setError(null);
        return data;
      } catch (error) {
        setError("Error al responder al comentario");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    comments,
    loading,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    replyToComment,
  };
};
