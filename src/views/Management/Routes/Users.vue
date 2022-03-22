<template>
  <article class="users-wrapper" v-if="tempAllowed">
    <section class="allowed-users">
      <div class="allowed-info">
        <h2>Usuários autorizados manualmente</h2>
        <p>
          Este sistema ignora o status na hotmart permitindo o login até a data definida.
          <br />
          <small><b>Obs.:</b> Usuários sem data, não expiram.</small>
        </p>
      </div>
      <Popup v-if="showPopup" :closePopup="closePopup">
        <form class="add-user-wrapper">
          <fieldset>
            <small>Email</small>
            <input type="email" id="tuser-email" required="true" v-model="tempUser._id" />
          </fieldset>
          <fieldset>
            <small>Plano</small>
            <select v-model="tempUser.plan">
              <option value="Community-Anual">Anual</option>
              <option value="Community-Mensal">Mensal</option>
            </select>
          </fieldset>
          <fieldset>
            <small>Expira em</small>
            <input type="date" id="tuser-date" v-model="tempUser.expires" />
          </fieldset>
          <button class="btn" @click.prevent="addUser">Adicionar</button>
        </form>
      </Popup>
      <transition-group name="list" mode="out-in" tag="ul" class="users-content-wrapper">
        <li class="add-user" key="add-user" @click="showPopup = true"></li>
        <li v-for="(user, key) in tempAllowed" :key="user._id" class="user-content">
          <fieldset>
            <small>Email</small>
            <span>{{ user._id }}</span>
          </fieldset>
          <fieldset>
            <small>Plano</small>
            <select v-model="tempAllowed[key].plan">
              <option value="Community-Anual">Anual</option>
              <option value="Community-Mensal">Mensal</option>
            </select>
          </fieldset>
          <fieldset>
            <small>Expira em</small>
            <input type="date" v-model="tempAllowed[key].expires" />
          </fieldset>
          <span class="mini-icon" @click="removeUser(user._id)">
            <i class="fas fa-trash"></i>
          </span>
        </li>
      </transition-group>
    </section>
  </article>
  <Loading v-else />
</template>

<script>
import { mapActions } from 'vuex';

import popup from '@/mixins/popup.js';
import alert from '@/mixins/alert.js';

import { api } from '@/services.js';

export default {
  name: 'Users',
  mixins: [popup, alert],
  data() {
    return {
      date: {
        temp: null,
        formated: null,
      },
      tempAllowed: null,
      tempUser: {
        _id: null,
        expires: null,
        plan: 'Community-Anual',
      },
    };
  },
  computed: {
    allowed: {
      get() {
        return this.$store.state.allowed;
      },
      set(value) {
        this.managementUpdate({ payload: value, route: 'ALLOWED' });
      },
    },
  },
  methods: {
    addUser() {
      if (!this.validity(['#tuser-email']))
        return this.sendPopupAlert('Preencha os campos corretamente.', 'error');

      if (
        this.tempAllowed.find(u => u._id.toLowerCase() == this.tempUser._id.toLowerCase())
      )
        return this.sendPopupAlert('Usuário já cadastrado, tente outro.', 'error');

      this.tempAllowed.push(this.tempUser);
      this.showPopup = false;

      this.tempUser = {
        _id: null,
        expires: null,
      };
      this.sendPopupAlert('Email adicionado com sucesso', 'success');
    },
    removeUser(id) {
      if (window.confirm(`Deseja remover este email? ( ${id} )`)) {
        this.tempAllowed = this.tempAllowed.filter(u => u._id != id);
        this.sendPopupAlert('Email removido com sucesso', 'success');
      }
    },
    removeFaq(faq) {
      if (window.confirm(`Deseja deletar a faq "${faq.title}"?`)) {
        api.delete('/management/faqs', { _id: faq._id }).then(response => {
          this.managementUpdate({
            payload: response.data,
            route: 'FAQS',
          });
        });
      }
    },
    ...mapActions(['managementGet', 'managementUpdate']),
  },
  watch: {
    allowed: {
      handler(values) {
        if (!this.tempAllowed)
          this.tempAllowed = values.map(user => ({
            _id: user._id,
            plan: user.plan,
            expires:
              user.expires &&
              new Date(user.expires)
                .toLocaleDateString('pt-BR', {
                  timeZone: 'UTC',
                })
                .split('/')
                .reverse()
                .join('-'),
          }));
      },
      deep: true,
    },
    tempAllowed: {
      handler(values, oldValues) {
        if (
          oldValues &&
          JSON.parse(JSON.stringify(values)) != JSON.parse(JSON.stringify(oldValues))
        )
          this.allowed = values.map(user => ({
            _id: user._id,
            plan: user.plan,
            expires: user.expires && user.expires.replaceAll('-', '/'),
          }));
      },
      deep: true,
    },
  },
  created() {
    this.managementGet({ route: 'ALLOWED' });
  },
};
</script>

<style scoped>
.users-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  color: var(--text-secondary);
  max-width: inherit !important;
}

.allowed-info {
  margin-bottom: 15px;
}

.allowed-info h2 {
  color: var(--text-lighted);
}

.allowed-info p {
  font-size: 0.9rem;
  margin-top: 4px;
  color: #8a8a86;
  white-space: unset;
  padding-left: 5px;
}

.allowed-info p small {
  display: block;
  padding: 5px 0 0 5px;
}

.users-wrapper section {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: auto;
}

.add-user {
  padding: 15px;
  border-radius: 5px;
  background: transparent;
  margin-top: 15px;
  color: var(--text-primary);
  text-align: center;
  border: 2px dashed;
  cursor: pointer;
}

.add-user:hover {
  background-color: #ffffff26;
}

.add-user::before {
  content: 'Adicionar email';
  font-size: 0.9rem;
  color: #c5c5bb;
}

.user-content,
.add-user-wrapper {
  background-color: #ffffff26;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
  color: var(--text-primary);
  position: relative;
}

.user-content > fieldset:not(:first-child),
.add-user-wrapper > fieldset:not(:first-child) {
  margin-top: 10px;
}
.user-content > fieldset small,
.add-user-wrapper > fieldset small {
  display: block;
  color: #c0c0ba;
  margin-bottom: 5px;
}

.user-content > fieldset span,
.add-user-wrapper > fieldset span {
  font-weight: bold;
}

.user-content > fieldset input,
.user-content > fieldset select {
  background-color: transparent;
  color: var(--text-primary);
  width: 100%;
  text-align: center;
  cursor: pointer;
}

.user-content > fieldset select option {
  color: var(--text-secondary);
}

.user-content .mini-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--primary);
}

.user-content .mini-icon:hover {
  background-color: rgb(233, 43, 43);
}

.add-user-wrapper {
  padding: 0;
  margin-top: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: clamp(200px, 45vw, 95vw);
}

.add-user-wrapper .btn {
  margin-top: 20px;
  align-self: flex-end;
}

.add-user-wrapper input,
.add-user-wrapper select {
  background-color: transparent;
  color: var(--text-secondary);
  width: 100%;
  text-align: left;
}
</style>
