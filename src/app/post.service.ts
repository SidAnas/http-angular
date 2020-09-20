import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Post } from '../app/post.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService{

  postSubject = new Subject<Post[]>();
  postsDeleted = new Subject<boolean>();
  errorErrorError = new Subject<string>();
  errorStatus = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string): void{
    const post: Post = {
      title: title,
      content: content
    };

    this.http.post<{name: string}>('https://ng-complete-guide-c330c.firebaseio.com/posts.json', post, {
      observe: 'response'
    }).subscribe(
      responseData => {
        console.log(responseData);
      }
    );
  }

  fetchPosts(): void{
    let modifiedParam = new HttpParams();
    modifiedParam = modifiedParam.append('print', 'pretty');
    modifiedParam = modifiedParam.append('key', 'value');
    this.http.get<{[key: string]: Post}>('https://ng-complete-guide-c330c.firebaseio.com/posts.json', {
      headers: new HttpHeaders().set('Custom-header', 'hello'),
      params: modifiedParam
    })
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
    , error =>{
      // console.log(error);
      this.errorErrorError.next(error.error.error);
      this.errorStatus.next(error.status);
      // console.log(this.errorOccured);
    });
  }

  onDeletePosts(): void{
    this.http.delete('https://ng-complete-guide-c330c.firebaseio.com/posts.json', {
      observe: 'events',
      responseType: 'json'
    }).pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Response){
        console.log(event.body);
      }
    }))
    .subscribe(
      () => {
        this.postsDeleted.next(true);
      }
    );
  }

}
