import { DOCUMENT } from '@angular/common';
import {Component, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],

})
export class InicioComponent implements OnInit{

  constructor(private title: Title, private meta: Meta, @Inject(DOCUMENT) private document: Document) {}
  
  ngOnInit(): void {
    this.title.setTitle('HT Sports');
    this.meta.updateTag({ name: 'description', content: 'HT Sports' });

    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', 'https://tfc-frontend-ten.vercel.app/');
    this.document.head.appendChild(link);


    this.meta.addTags([
      { property: 'og:title', content: 'HT Sports' },
      { property: 'og:description', content: 'HT Sports' },
      { property: 'og:url', content: 'https://tfc-frontend-ten.vercel.app/' }
    ]);
  }



}
