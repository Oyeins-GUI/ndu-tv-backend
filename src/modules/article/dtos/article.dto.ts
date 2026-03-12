import { Articles } from '../../../db/models/article.model';

export class ArticleDto {
  public id: string;

  public author_name: string;

  public admin_id: string;

  public content: string;

  public summary: string;

  public title: string;

  public image_url: string;

  public is_featured: boolean;

  public is_approved: boolean;

  public created_at: string;

  constructor(model: Articles) {
    this.id = model.id;
    this.author_name = model.author_name;
    this.admin_id = model.admin_id;
    this.content = model.content;
    this.summary = model.summary;
    this.title = model.title;
    this.image_url = model.image_url;
    this.is_approved = model.is_approved;
    this.is_featured = model.is_featured;
    this.created_at = model.created_at.toDateString();
  }

  static fromEntities(models: Articles[]): ArticleDto[] {
    return models.map((m) => new ArticleDto(m));
  }
}
