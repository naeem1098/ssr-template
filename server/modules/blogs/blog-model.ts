
export interface IBlog {
    blogId: string,
    heading: string,
    coverImage: string,
    text: string,
    imageUrls: string[],
    keywords: string[],
    author: string,
    reads: number,
    likes: number,
    timestamp: number
}