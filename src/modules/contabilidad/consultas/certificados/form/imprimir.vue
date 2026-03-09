<template>
  <div>
    <l-newmodal
      width="1300px"
      ref="imprimir"
      :validar_salir="false"
      :titulo="`Certificado ${tipo}`"
      footer
    >
      <template slot="body">
        <div class="row">
          <div class="col-12 q-pa-sm" v-show="oculta_cdos">
            <can
              permiso="view_menu_gestion_contable_consultas_certificados_enviar_correo"
            >
              <div class="row">
                <div class="col-8">
                  <q-input
                    label="Correos a enviar"
                    dense
                    outlined
                    rounded
                    class="email emailtarjeta"
                    v-model="correos"
                    ref="inputcorreo"
                    :rules="[
                      (val) =>
                        direccionEmail(val) || 'Correo electrónico inválido',
                    ]"
                  />
                  <label
                    class="text-grey"
                    >* Para enviar a más de un correo separar con (;) y no dejar
                    espacios entre los correos.</label
                  >
                </div>
                <div class="col-4 q-pt-xs">
                  <q-btn
                    class="q-ml-md"
                    unelevated
                    dense
                    rounded
                    color="primary"
                    icon="send"
                    @click="enviarcorreo(1)"
                    :disable="!direccionEmail(correos) || correos == ''"
                  >
                    <q-tooltip>Enviar solo a estos correos</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </can>
          </div>
          <div class="col-12 q-mt-md">
            <iframe :src="url.path" width="100%" height="600px"></iframe>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="row justify-center">
          <can
            class="col-3"
            permiso="view_menu_gestion_contable_consultas_certificados_enviar_correo"
          >
            <q-btn
              class="btn_send full-width"
              rounded
              color="amber"
              @click="enviarcorreo(2)"
              :disabled="oculta_cuno"
            >
              <span class="qbtn-label">Enviar Correo</span>
            </q-btn>
          </can>
        </div>
      </template>
    </l-newmodal>
  </div>
</template>

<script>
export default {
  name: "imprimir",
  data() {
    return {
      url: {},
      tipo: null,
      correos: null,
      oculta_cuno: false,
      oculta_cdos: false,
    };
  },
  methods: {
    enviarcorreo(tipocorreo) {
      this.$emit("enviar_correo", {
        val: 4,
        tipo: tipocorreo,
      });
    },
    abrirmodal(model, tipo, data, tab) {
      this.tipo = tipo;
      this.url = model;
      if (data.length > 1) {
        this.oculta_cuno = false; //inhabilitar
        this.oculta_cdos = false; //inhabilitar
      } else {
        if (data.length == 1 && tab == "conceptos") {
          this.oculta_cuno = false; //habilitar
          this.oculta_cdos = true; //habilitar
        }
        if(data.length == 1 || tab == 'movimientos'){
          this.oculta_cuno = true //inhabilitar
          this.oculta_cdos = false //inhabilitar
        }
        if(data.length == 1 || data.tipo == 'retenciones'){
          this.oculta_cuno = false //inhabilitar
          this.oculta_cdos = true //inhabilitar
        }
      }

      this.$refs.imprimir.open();
    },
    direccionEmail(email) {
      // var validar=/^[A-Za-z][A-Za-z0-9_]*@[A-Za-z0-9_]+\.[A-Za-z0-9_.]+[A-za-z]$/;
      if (email != null && email != "") {
        var validar =
          /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

        var emails = email.split(";"), //array de emails separados por punto y coma
          valido = true;
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
      }
    },
  },
  watch: {
    correos(val) {
      this.$emit("value_correo", val);
    },
  },
};
</script>

<style>
.emailtarjeta div.q-field__bottom.row.items-start.q-field__bottom--animated {
  display: none;
}
.emailtarjeta {
  padding-bottom: 0px;
}
</style>

<style lang="scss">
@mixin btnaccionesmodal($codeicon) {
  &:hover {
    & .qbtn-label {
      position: relative;
      &::before {
        content: $codeicon;
        font-family: "Material Icons";
        position: absolute;
        left: -25px;
        font-size: 18px;
      }
    }
  }
}
.btn_send {
  @include btnaccionesmodal("\e163");
}
</style>