import ArticleDetail from "../../../components/articles/ArticleDetail";


export default function ArticlePage({ params }: { params: { id: string } }) {
    return <ArticleDetail id={params.id} />;
}