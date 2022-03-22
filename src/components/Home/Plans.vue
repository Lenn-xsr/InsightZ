<template>
  <section class="plans" id="planos">
    <h2>Chegou a hora de evoluir</h2>
    <p>
      Assine agora e aprenda tudo para crescer profissionalmente na área de 3D para jogos.
    </p>
    <div class="plans-wrapper lock-width">
      <div class="plan">
        <h2 class="plan-type">Mensal</h2>
        <ul>
          <li><span>4 Aulas ao vivo por mês</span></li>
          <li>Acesso a todas as <span>aulas gravadas anteriormente</span></li>
          <li>Acesso ao nosso <span>grupo exclusivo no Discord</span></li>
          <li><span>Diversas ferramentas</span> e materiais de apoio</li>
        </ul>
        <div class="plan-price">
          <span class="plan-price-month">R$ 69,90</span>
        </div>
        <a
          href="https://pay.hotmart.com/L19074131Q?off=79ct12ot&checkoutMode=10"
          target="_blank"
          class="btn btn2"
          rel="noopener noreferrer"
          >ASSINE AGORA</a
        >
      </div>

      <div class="plan">
        <h2 class="plan-type">Anual</h2>
        <ul>
          <li><span>4 Aulas ao vivo por mês</span></li>
          <li>Acesso a todas as <span>aulas gravadas anteriormente</span></li>
          <li>Acesso ao nosso <span>grupo exclusivo no Discord</span></li>
          <li><span>Diversas ferramentas</span> e materiais de apoio</li>
          <li>
            Acesso a <span>cursos completos</span> exclusivos com todo workflow para
            games.
          </li>
          <li>Acesso a área exclusiva <span>Vivendo de 3D</span></li>
          <li><span>Dicas e feedbacks em vídeo</span></li>
          <li><span>Dúvidas e dicas por chat</span></li>
        </ul>
        <div class="plan-price">
          <span>12x de</span>
          <span class="plan-price-month">R$ 79,90</span>
          <span>ou à vista R$ 958,80</span>
        </div>
        <a
          href="https://pay.hotmart.com/L19074131Q?off=hx9cl10v&checkoutMode=10"
          class="btn"
          target="_blank"
          rel="noopener noreferrer"
          >ASSINE AGORA</a
        >
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Plans',
};
</script>

<style scoped>
.plans-wrapper {
  display: flex;
  margin: 1.875rem auto 0 auto;
  justify-content: center;
  align-items: flex-start;
}

.plans {
  background-color: var(--secondary);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
}

.plans > h2 {
  margin-bottom: 10px;
  text-align: center;
}

.plans > p {
  text-align: center;
  max-width: 90%;
}

.btn2 {
  color: var(--activated);
  background-color: #b7b6b6;
}

.plan {
  flex: 1;
  max-width: 21.25rem;
  padding: 1.875rem;
  padding-bottom: 2.433rem;
  border-radius: 4px;
  margin: 0.9375rem;
  box-shadow: var(--default-shadow);
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--text-primary);
  outline: 1px solid var(--text-primary);
  outline-offset: -10px;
}

.plan-price span {
  font-size: 1.125rem;
  font-weight: normal;
  line-height: 1.2;
  color: #b0b2b3;
  display: block;
  text-align: center;
  margin-bottom: 0.625rem;
}

.plan-price .plan-price-month {
  font-size: 2.25rem;
  font-weight: normal;
  line-height: 1.2;
  color: #ffffff;
}

.plan li::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: var(--text-lighted);
  border-radius: 50%;
  border: 2px solid #0e1013;
  margin-right: 0.625rem;
  position: relative;
  top: -1px;
}

.plan li {
  padding: 0.775rem 0;
}

.plan li span {
  color: var(--text-lighted);
  font-weight: bold;
}

.plan ul {
  font-size: 0.937rem;
  font-weight: normal;
  line-height: 1.2;
  color: #b0b2b3;
  margin-bottom: 20px;
}

.plan-type {
  font-size: 2.25rem;
  font-weight: normal;
  line-height: 1.2;
  color: var(--text-primary);
  text-align: center;
  font-weight: normal;
  margin-bottom: 1.25rem;
}

.btn {
  position: absolute;
  bottom: -19px;
  align-self: center;
  padding: 10px 40px;
}

@media (max-width: 624px) {
  .plans-wrapper {
    flex-direction: column;
  }

  .plan {
    margin-bottom: 40px;
  }
}
</style>
