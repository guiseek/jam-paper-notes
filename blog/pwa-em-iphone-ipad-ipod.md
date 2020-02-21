---
title: PWA em dispositivos apple
description: Qual o comportamento dos Progressive Web Apps nos dispotivos da Apple
publish: false
category: Web App
tags: pwa, apple, web app
---

# PWA em dispositivos apple

Fala aí estudantes de tecnologia, bom dia, boa tarde, boa noite!

Você tem dispositivo Android ou Apple? quem sabe os dois, como é meu caso. Se use android deve ter notado que quando acessa um web app configurado como progressive web app o navegador solicita automaticamente que você adicione o aplicativo à sua tela inicial, se usa apple ou os dois, não notou né? o motivo é que ele não faz isso.

Porém, ele permite que o app seja adicionado a tela inicial e podendo depois disso ser iniciados sem a interface estranha do safari, sendo assim ele suporta pwa mas infelizmente falta esse detalhe muito importante, que é solicitar de forma automática.

> info **Pergunta** Como resolver o caso do Safari não apresentar o popup perguntando se o usuário deseja adicionar o aplicativo?

### Requisitos

1. Recursos necessários
2. Quanto solicitar e não solicitar
3. Apresentar a solicitação
5. Gerenciar


#### Recursos necessários

Precisamos de um **componente**, um **serviço** e um **banco de dados**.

- O serviço para decidir quando apresentar ou não
- O componente para apresentar a solicitação
- Um banco de dados para salvar a solicitação já apresentada.

Tendo isso, fazemos a chamada do serviço no bootstrap na aplicação.

> alert **Pré-requisitos** Tenho como premissa que você como estudioso e caiu aqui com esta dúvida, já tenha um app funcional e sendo assim talvez seja necessária apenas uma instalação que usaremos de banco. O **IDB-Keyval**.

```sh
$ npm i idb-keyval
```

Eu uso Angular + Angular Material e vou trabalhar com ela neste post. Tentarei ser agnóstico quanto a explicações pra facilitar outras implementações, ok?

*Então crie seu serviço e seu componente.*


#### Quando solicitar e não solicitar

Identificando usuários iOS

```javascript
get iOS() {
  return /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
}
```

Identificando o modo de exibição do app, caso o usuário já tenha instalado, o retorno será `standalone`, mas vamos criar um método mais genérico.

Crie um tipo com as possibilidades de exibição.

```javascript
export type NavigatorDisplayMode = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
```

Adicione ao serviço o método que retorna um boolean do método solicitado.

```javascript
inMode(mode: NavigatorDisplayMode) {
  return (mode in window.navigator) && window.navigator[mode];
}
```

#### Apresentar a solicitação

Com o componente criado, Adicione a mensagem de solicitação e um botão confirmando que o usuário leu.

```javascript
export class PwaAppleToastComponent implements OnInit {

  constructor(
    private snackRef: MatSnackBarRef<PwaAppleToastComponent>
  ) { }

  ngOnInit() {
  }

  onUnderstand() {
    this.snackRef.dismissWithAction();
  }
}
```

```html
<div class="content">
  <mat-icon>info</mat-icon>
  <span>Para instalar o aplicativo, toque no ícone <strong>Compartilhar</strong> abaixo e selecione <strong>Adicionar à tela inicial</strong>.</span>
</div>
<div class="action">
  <button mat-button color="primary" (click)="onUnderstand()">
    Entendi
  </button>
</div>
```

```css
:host {
  .content {
    display: flex;
    flex-direction: row;

    .mat-icon {
      color: white;

      padding-right: 12px;
    }
    strong {
      color: white;
    }
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 12px;
    margin-bottom: 4px;
  }
}
```

#### Gerenciar

Então podemos criar o método que analisa e toma a decisão de apresentar ou não.

Adicione mais este método ao seu serviço.

```javascript
async showTipToInstall() {
  const wasShown = await get('tipToInstall');

  if (this.iOS && !this.inMode('standalone') && wasShown === undefined) {
    await this.snack.openFromComponent(PwaAppleToastComponent)
      .onAction().toPromise();

    set('tipToInstall', true);
  }
}
```

Então o serviço está completo.

```javascript
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { get, set } from 'idb-keyval';
import { PwaAppleToastComponent } from './../components/pwa-apple-toast/pwa-apple-toast.component';

export type NavigatorDisplayMode = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    @Inject(PLATFORM_ID) private platform: any,
    private snack: MatSnackBar
  ) { }

  get iOS() {
    return /iphone|ipad|ipod/.test(
      window.navigator.userAgent.toLowerCase()
    );
  }
  inMode(mode: NavigatorDisplayMode) {
    return (mode in window.navigator) && window.navigator[mode];
  }
  async showTipToInstall() {

    const wasShown = await get('tipToInstall');

    if (this.iOS && !this.inMode('standalone') && wasShown === undefined) {
      await this.snack.openFromComponent(PwaAppleToastComponent)
        .onAction().toPromise();

      set('tipToInstall', true);
    }
  }
}
```


Agora basta chama-lo no `bootstrap` do app, no meu caso adicionei app `ngOnInit` do `AppComponent`.

```javascript
@Component({
  selector: 'blog-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.toast.showTipToInstall();
  }
}
```

E está feito, agora teste usando simulador do XCode ou com Safari, no modo responsivo, ele permite fazer o teste em dispositivos iPad, Iphone e etc...

Esta é a solução usada neste blog que está lendo!

Espero ter ajudado.

Abraços

[]s
