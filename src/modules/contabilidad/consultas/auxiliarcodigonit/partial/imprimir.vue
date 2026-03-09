<template>
  <div>
    <l-newmodal
      width="1300px"
      ref="imprimirconsulta"
      :validar_salir="false"
      footer
      :titulo="`Impresión de consulta - ${tipodocumento}`"
    >
      <template slot="body">
        <q-form ref="impresion" class="row q-pa-sm">
          <div class="col-12" v-if="enviar_correo">
            <label>Correo(s) *</label>
            <q-input
              input-style="padding: 0px;"
              dense
              outlined
              v-model="model.email"
              ref="inputcorreo"
              :rules="[
                (val) => direccionEmail(val) || 'Correo electrónico inválido',
                $rules.required($t('validator.required')),
              ]"
            />
            <label
              class="text-grey"
              style="font-size: 9px !important; line-height: 0.75rem !important"
            >
              - PARA ENVIAR A MÁS DE UN CORREO SEPARAR CON ; Y NO DEJAR ESPACIOS
              ENTRE LOS CORREOS.
            </label>
          </div>
          <div class="col-12 q-mt-md">
            <iframe :src="url.path" width="100%" height="600px"></iframe>
          </div>
        </q-form>
      </template>
      <template slot="footer">
        <div class="row justify-center q-gutter-x-md">
          <div class="col-2">
            <q-btn
              rounded
              color="green"
              @click="enviarCorreo()"
              class="full-width"
            >
              <label class="qbtn-label">Enviar Correo</label>
            </q-btn>
          </div>
          <div class="col-2">
            <q-btn
              rounded
              color="amber"
              @click="$refs.imprimirconsulta.close()"
              class="full-width"
            >
              <label class="qbtn-label">Listo</label>
            </q-btn>
          </div>
        </div>
      </template>
    </l-newmodal>
  </div>
</template>

<script>
export default {
  name: "imprimirconsulta",
  props: {
    email: {
      type: String,
      default: null,
    },
    enviar_correo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      url: {},
      tipodocumento: "",
      model: {
        email: null,
      },
    };
  },
  methods: {
    async enviarCorreo() {
      const validate = await this.$refs.impresion.validate();
      if (validate) {
        this.$emit("enviarCorreo", this.model.email);
      }
    },
    abrirmodal(model, tipo) {
      this.model.email = this.email;
      switch (tipo) {
        case 1:
          this.tipodocumento = "Código clasificado por nit";
          break;
        case 2:
          this.tipodocumento = "Código y nit";
          break;
        case 3:
          this.tipodocumento = "Código";
          break;
        case 4:
          this.tipodocumento = "Nit/Cuenta";
          break;
        case 5:
          this.tipodocumento = "Nit";
          break;
      }
      this.url = model;
      this.$refs.imprimirconsulta.open();
    },
    direccionEmail(email) {
      var validar =
        /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

      var emails = email;
      if (emails != null && emails != "") {
        emails = email.split(";"); //array de emails separados por punto y coma
        var valido = true;
        for (var i = 0, l = emails.length; i < l; i++) {
          if (!validar.test(emails[i])) {
            //Si el e-mail no es válido
            valido = false;
            break;
          }
        }
        if (valido || !email.length) {
          //Si la validación es true o si no se ingresaron datos
          return true;
        } else return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style>
</style>