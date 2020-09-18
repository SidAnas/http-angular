import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostService } from '../app/post.service';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  isFetching = false;
  @ViewChild('postForm') form: NgForm;

  constructor(private postService: PostService) {}

  ngOnInit(): void {}

  onCreatePost(postData: Post): void {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);
    this.form.resetForm();
  }

  onFetchPosts(): void {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPosts();
    this.postService.postSubject.subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    });
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

}
