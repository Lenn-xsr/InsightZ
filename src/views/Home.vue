<template>
  <main class="home">
    <section class="top-content">
      <div class="top-text lock-width">
        <h1>Tudo para você evoluir de forma mais rápida e segura na área de Games.</h1>
        <img src="@/assets/Community.webp" />
        <p>Assine agora e tenha acesso ao melhor conteúdo de Games do Brasil</p>
        <a
          href="https://pay.hotmart.com/L19074131Q?off=hx9cl10v&checkoutMode=10"
          target="_blank"
          class="btn"
          >ASSINE AGORA</a
        >
      </div>
      <div class="background-video">
        <video
          role="presentation"
          crossorigin="anonymous"
          playsinline=""
          preload="auto"
          muted=""
          loop=""
          autoplay=""
          tabindex="-1"
          src="@/assets/Background-video.mp4"
        ></video>
      </div>
    </section>
    <section class="about lock-width">
      <div class="box line">
        <h2>O que é a Insight<span>Z</span>?</h2>
        <p>
          A InsightZ é focada no aprendizado de 3D para Jogos, aqui você encontrará
          tutoriais de diversas ferramentas, tudo explicado de forma clara e objetiva.
        </p>
        <iframe
          allowfullscreen="1"
          title="YouTube video player"
          src="https://www.youtube.com/embed/vFe1dC4JPqo?autoplay=0&amp;mute=0&amp;controls=1&amp;loop=0&amp;origin=https%3A%2F%2Fwww.insightz3d.com&amp;playsinline=1&amp;enablejsapi=1&amp;widgetid=1"
          frameborder="0"
        ></iframe>
        <p>
          São mais de 300 vídeos tutoriais, aulas ao vivo toda semana, dicas dos softwares
          mais usados na indústria, lives com profissionais da área e o melhor, tudo
          GRATUITO.
        </p>
        <a
          href="https://www.youtube.com/channel/UCYXoautmTvZFuU1Lj6XLJ8Q"
          class="btn"
          target="_blank"
          >Acessar Canal</a
        >
      </div>
      <div class="box line">
        <h2>O que é a Insight<span>Z Community?</span></h2>
        <p>
          A InsightZ Community é uma comunidade exclusiva para assinantes onde ensinamos
          tudo o que sabemos sobre 3D para jogos. Com mais de 100 horas de conteúdo além
          de ensinarmos 3D abordamos assuntos sobre como entrar no mercado de trabalho,
          como ajustar seu portfólio, como aplicar para empresas, quanto cobrar, e tudo
          isso com nossa mentoria mensal para que você fique 100% seguro nesta carreira.
        </p>
      </div>
      <div class="box line">
        <h2>Pra quem é a Insight<span>Z Community</span>?</h2>
        <p>
          Pra você que quer trabalhar fazendo 3D na área de jogos mas não sabe por onde
          começar, pra você que já esta na área mas quer se profissionalizar ainda mais,
          pra você que tem dúvida sobre criação de assets 3D, pra você que tem medo de
          aplicar para empresas.<br /><br />Estamos aqui para dar aquele empurrão que
          falta para você começar a seguir firme na área de Games.
        </p>
      </div>
      <div class="box line">
        <h2>Nós criamos um método que <span>funciona</span>.</h2>
        <p>
          Nossos conteúdos são 100% explicados, não escondemos nada, não tem truques nem
          mágica, não mostramos só o lado bonito, ensinamos realmente como as coisas
          funcionam de forma clara e direta para que todos consigam entender.
        </p>
      </div>
      <div class="box">
        <h2>Estude a qualquer <span>hora</span> em qualquer <span>lugar</span>.</h2>
        <img src="@/assets/Telas.webp" />
        <p>
          Acesse nosso conteúdo em todas as plataformas, através da plataforma Hotmart
          Sparkle.<br /><br />Baixe Agora
        </p>
        <div>
          <a
            href="https://play.google.com/store/apps/details?id=com.hotmart.sparkle&hl=pt_BR&gl=US"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="@/assets/GooglePlay.webp" />
          </a>
          <a
            href="https://apps.apple.com/br/app/hotmart-sparkle/id1066849827"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="@/assets/AppleStore.webp" />
          </a>
        </div>
      </div>
    </section>
    <Plans />
    <Faq />
  </main>
</template>

<script>
import Plans from '@/components/Home/Plans.vue';
import Faq from '@/components/Home/Faq.vue';

export default {
  name: 'Home',
  components: { Plans, Faq },
};
</script>

<style scoped>
h1 {
  font-size: 32px;
  margin-bottom: 20px;
  max-width: 350px;
  text-align: start;
}

h1 span,
h2 span {
  color: var(--text-lighted);
}

p {
  font-size: 18px;
  max-width: 75%;
}

.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 70px;
}

.background-video {
  max-height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  position: absolute;
  background-color: var(--lighted);
  background-image: url('https://static.wixstatic.com/media/0da768_8fae2cc5b7bf477fb13faa1f2582dbd2.png/v1/crop/x_0,y_0,w_4,h_6,q_85/0da768_8fae2cc5b7bf477fb13faa1f2582dbd2.webp');
  background-size: auto;
  background-repeat: repeat;
  background-position: center center;
  max-width: 100%;
  top: 0;
  z-index: 1;
}

.background-video video {
  min-width: 100vw;
  position: relative;
  top: 0;
  opacity: 0.4;
  pointer-events: none;
}

.top-content {
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-bottom: 2px solid var(--text-lighted);
  width: 100%;
}

.top-text {
  display: flex;
  padding: 40px;
  height: max-content;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  z-index: 2;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  padding-top: 100px;
  padding-bottom: 70px;
}

.top-text img {
  width: 50vw;
  max-width: 572px;
  min-width: 350px;
  position: absolute;
  right: 0;
  top: 15%;
}

.box.line::after {
  content: '';
  display: block;
  width: 1px;
  height: 200px;
  margin: auto;
  background-color: var(--text-lighted);
}

.about {
  padding: 50px 0;
  display: flex;
  flex-direction: column;
}

.about h2 {
  font-size: 25px;
  max-width: 90%;
}

.about p {
  font-size: 17px;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  margin-bottom: 50px;
  text-align: center;
}

.box > img {
  max-width: 80%;
}

.box > div {
  display: flex;
  align-items: center;
  padding: 5px;
}

.box > div > a {
  margin: 0 5px;
}

iframe {
  width: 85%;
  height: 46vw;
  max-width: 680px;
  max-height: 400px;
}

@media (max-width: 724px) {
  h1 {
    margin-bottom: 0;
  }

  .top-text img {
    position: unset;
  }
}
</style>
