import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PostService } from '../app/post.service';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  @ViewChild('postForm') form: NgForm;
  error = null;
  errStatus: string;
  errorErrorSubs: Subscription;
  postSubs: Subscription;
  errorStatusSubs: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit(): void {}

  onCreatePost(postData: Post): void {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);
    this.form.resetForm();
  }

  onHandleError(): void{
    this.error = null;
  }

  onFetchPosts(): void {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPosts();
    this.postSubs = this.postService.postSubject.subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    });
    this.errorErrorSubs = this.postService.errorErrorError.subscribe(
      (error) => {
        this.isFetching = false;
        this.error = error;
        // console.log(this.error);
        // console.log(error);
      }
    );
    this.postService.errorStatus.subscribe(
      (errorStatus) => {
        this.isFetching = false;
        this.errStatus = errorStatus;
      }
    );
  }

  onClearPosts(): void {
    // Send Http request
    this.postService.onDeletePosts();
    this.postService.postsDeleted.subscribe(
      isdeleted => {
        this.loadedPosts = [];
      }
    );
  }

  ngOnDestroy(): void{
    this.postSubs.unsubscribe();
    this.errorErrorSubs.unsubscribe();
    this.errorStatusSubs.unsubscribe();
  }

}
