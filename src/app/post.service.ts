import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from '../app/post.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService{

  postSubject = new Subject<Post[]>();
  postsDeleted = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string): void{
    const post: Post = {
      title: title,
      content: content
    };

    this.http.post<{name: string}>('https://ng-complete-guide-c330c.firebaseio.com/posts.json', post).subscribe(
      responseData => {
        console.log(responseData);
      }
    );
  }

  fetchPosts(): void{
    this.http.get<{[key: string]: Post}>('https://ng-complete-guide-c330c.firebaseio.com/posts.json')
    .pipe(
      map( (responseData) => {
        const postArray: Post[] = [];
        for (const key in responseData){
          if (responseData.hasOwnProperty(key)){
            postArray.push({ ...responseData[key], id: key });
          }
        }
        return postArray;
      })
    )
    .subscribe(
      posts => {
        this.postSubject.next(posts);
      }
    );
  }

  onDeletePosts(): void{
    this.http.delete('https://ng-complete-guide-c330c.firebaseio.com/posts.json').subscribe(
      () => {
        this.postsDeleted.next(true);
      }
    );
  }

}
