<template>
  <l-newmodal
    ref="modalcargos"
    :validar_salir="false"
    :persistent="true"
    titulo="Vista previa cargos fijos"
    width="1100px"
    footer
  >
    <template slot="body">

    <div class="q-pa-md">
      <q-form ref="formpago" class="row q-pb-sm">
        <div class="row col-12">
          <div class="col-md-6 q-pl-xs">
            <div>
              <q-radio
                v-model="model.tipo"
                :val="2"
                label="Egreso"
                class="q-mr-sm"
                dense
              />
              <q-radio
                v-model="model.tipo"
                :val="6"
                class="q-mr-sm"
                label="Nota de Contabilidad"
                dense
              />
            </div>
            <div class="col-6 q-mt-md">
              <div>
                <q-radio
                  v-model="model.tipo_generacion_documento"
                  :val="1"
                  label="Uno por cada pago"
                  class="q-mr-sm"
                  dense
                />
                <q-radio
                  v-model="model.tipo_generacion_documento"
                  :val="2"
                  class="q-mr-sm"
                  label="Uno por todos los pagos"
                  dense
                />
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-12 q-pt-lg">
          <div class="row full-width q-gutter">
            <l-select
              col="3 text-black"
              option-value="id"
              v-model="model.formapago"
              option-label="nombre"
              label="Forma de pago"
              :options="forma_pago_filter"
              :rules="[true]"
            />
            <l-input
              col="3 text-black"
              label="Número"
              v-model="model.numcheque"
              :rules="[true]"
              v-if="(model.formapago === 2) && model.formapago != null"
            />
            <l-select
              col="3 text-black"
              value="id"
              option-label="nombre"
              label="Banco"
              :options="ctabancos"
              v-model="model.banco_id"
              v-if="
                (model.formapago === 2 || model.formapago === 3) &&
                model.formapago != null
              "
            />
            <l-select-rest
              col="3"
              url="tercero/personas/selectnew"
              v-model="model.persona"
              label="Nit para generar documento"
              icon="person_search"
              v-if="model.tipo_generacion_documento == 2"
              :rules="[$rules.required($t('validator.required'))]"
            />
          </div>
        </div>
      </q-form>
      <q-table
        flat
        bordered
        :data="data"
        :columns="columns"
        :pagination.sync="pagination"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:bottom-row>
          <q-tr>
            <q-td colspan="100%">
              <div class="flex justify-end">
                <strong>Gran Total = {{ formatMoney(grantotal) }}</strong>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    </template>
    <template slot="footer">
      <div class="row justify-center">
          <div class="col-4">
           <q-btn
            dense
            unelevated
            class="full-width btnGuardar"
            label="Continuar"
            type="buttom"
            @click="onSubmit()"
          >
            <q-tooltip>Continuar</q-tooltip>
          </q-btn>
          </div>
      </div>
    </template>

  </l-newmodal>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import can from "components/can.vue";
export default {
  name: "modalpagocargosfijos",
  components: { can },
  data() {
    return {
      data: [],
      forma_pago_filter: [],
      pagination: { rowsPerPage: 10 },
      fechas: {
        fecha: moment().format("DD/MM/YYYY"),
      },
      model: {
        tipo: 2,
        numcheque: null,
        formapago: null,
        banco_id: null,
        tipo_generacion_documento: 1,
        persona: null,
      },
      columns: [
        { name: 'nombre', field: 'n_completo', label: 'Nombre', align: 'left', sortable: true },
        { name: 'documento', field: 'documento', label: 'Nit', align: 'left', sortable: true },
        { name: 'cuota_numero', field: 'cuota_numero', label: 'N° Cuota', align: 'left', sortable: true },
        { name: 'detalle', field: 'detalle', label: 'Detallado', align: 'left', sortable: true },
        { name: 'valor_cuota', label: 'Total a pagar', field: 'valor_cuota', align: 'left', format: (val) => this.formatMoney(val) }
      ]
    }
  },
  computed: {
    ...mapState("generales", ["forma_pago"]),
    grantotal() {
      let total = 0;
      this.data.forEach((element) => {
        total += parseInt(element.valor_cuota);
      });
      return total;
    },
  },
  methods: {
    ...mapActions("generales", ["getFormaPago"]),
    openModal(arrayData) {
      this.model = {
        tipo: 2,
        numcheque: null,
        formapago: null,
        banco_id: null,
        tipo_generacion_documento: 1,
        persona: null,
      };
      this.data = [];
      this.data = arrayData;
      this.$refs.modalcargos.open();
    },
    formatMoney(val) {
      if (val == null) {
        val = 0;
      }
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
      return formatterPeso.format(val);
    },
    async onSubmit() {
      const arrayPersonas = [];
      const usuario = this.$store.getters["auth/user"].id;
      const fechaActual = moment().format("YYYY-MM-DD");
      const idsUniques = [...new Set(this.data.map((item) => item.idPersona))];
      let num_cheque = parseInt(this.model.numcheque) - 1;
      for (const item of idsUniques) {
        num_cheque++;
        const filtro = this.data.filter((a) => a.idPersona === item);
        const total = filtro.reduce((acc, val) => acc + parseInt(val.valor_cuota), 0);
        const conceptoId = filtro[0].concepto_id;
        const nCompleto = filtro[0].n_completo;
        const inmuebleId = filtro[0].inmueble_id;
        const dir_inm = filtro[0].direccion_inm
        const detalleCargo = filtro[0].detalle;

        
        
        const persona = {
          encabezado: {
            tipodocumento: this.model.tipo,
            tipo: this.model.tipo,
            fecha: fechaActual,
            concepto: conceptoId,
            detalle: `${detalleCargo} CARGO FIJO/${inmuebleId} - ${nCompleto} - [${inmuebleId}] [${dir_inm}]`,
            referencia: null,
            persona: item,
            beneficiario: null,
            tipopago: this.model.formapago,
            total,
            numcheque: num_cheque++,
            ctadestino: null,
            ctaorigen: this.model.banco_id,
            bancodestino: null,
            id: 0,
            usuario,
            efectivo: this.model.formapago === 1 ? this.grantotal : 0,
            cheques: this.model.formapago === 2 ? this.grantotal : 0,
            consignacion: 0,
            tarjeta: 0,
          },
          consignacion: {
            valor: 0,
            banco: null,
            numero: null,
            fecha: null,
          },
          tarjeta: {
            valor: 0,
            banco: null,
            clase: null,
            numero: null,
            tipo: null,
          },
          cheques: [],
          ids_cargos: [...new Set(filtro.map((item) => item.id))],
          contabilizacion: []
        };

        const debitos =  filtro.map((elementDb)=> ({
              mayor_id: 0,
              concepto_id: conceptoId,
              persona_id: elementDb.idPersona,
              valordb: elementDb.valor_cuota,
              valorcr: 0,
              inmu_id: elementDb.inmueble_id,
              tercero_id: elementDb.beneficiario_id,
              detalle: `CUOTA ${elementDb.cuota_numero}/${elementDb.total_cuotas} ${elementDb.detalle} CARGO FIJO/${elementDb.inmueble_id} - ${elementDb.n_completo} - [${elementDb.inmueble_id}] [${elementDb.direccion_inm}]`,
              mov_id: "0",
              sistema: 0,
              base: 0,
              cc_id: elementDb.centro_costos_id
            }))
           
          const creditos = filtro.map((element) => ({
              mayor_id: element.mayor_id,
              concepto_id: element.concepto_id,
              persona_id: element.persona_id,
              valordb: 0,
              valorcr: parseInt(element.valor_cuota),
              inmu_id: element.inmueble_id,
              tercero_id: null,
              detalle: `CUOTA ${element.cuota_numero}/${element.total_cuotas} ${element.detalle} CARGO FIJO/${element.inmueble_id} - ${element.n_completo} - [${element.inmueble_id}] [${element.direccion_inm}]`,
              mov_id: "0",
              sistema: 0,
              base: 0,
              cc_id: element.centro_costos_id
            }))

            for (let i = 0; i < filtro.length; i++) {
                  persona.contabilizacion.push(debitos[i]);
                  persona.contabilizacion.push(creditos[i]);
             }

        arrayPersonas.push(persona);
      }
      if (!this.model.formapago && ![6].includes(this.model.tipo)) {
        this.LInfo("warning", "Por favor seleccione una forma de pago.");
        return;
      }
      if (
        [2].includes(this.model.tipo_generacion_documento) &&
        ["", null, undefined].includes(this.model.persona)
      ) {
        this.LInfo("warning", "Por favor seleccione una persona para generar documento.");
        return;
      }
      if (
        [2, 3].includes(this.model.formapago) &&
        ["", null, undefined].includes(this.model.banco_id)
      ) {
        this.LInfo("warning", "Por favor seleccione un banco para continuar el proceso.");
        return;
      }
      if (
        [2].includes(this.model.formapago) &&
        ["", null, undefined].includes(this.model.numcheque)
      ) {
        this.LInfo(
          "warning",
          "Por favor ingrese el número de cheque para continuar el proceso."
        );
        return;
      }
      const params = {
        id_cta_banco: [2, 3].includes(this.model.formapago) ? this.model.banco_id : null,
        data: arrayPersonas,
        model: this.model,
      };
      await this.PostNew("contabilidad/cargos_fijos/generar_documentos/", params).then(
        (response) => {
          if (response.status == 200) {
            this.LFinish(
              `Documento(s) ${response.msg} generado(s) correctamente`,
              () => {
                this.$emit("refresh");
                this.$emit("resetCheck");
                this.$refs.modalcargos.close();
              },
              false
            );
          } else {
            this.LInfo("warning", response.msg);
          }
        }
      );
    },
    async getCtaBanco() {
      const data = await this.Get("contabilidad/ctabanco");
      this.ctabancos = data;
    },
  },
  async created() {
    await this.getFormaPago();
    await this.getCtaBanco();
    this.forma_pago_filter = this.forma_pago.filter((x) => [1, 2, 3].includes(x.id));
  },
};
</script>
<style lang="scss">
.q-table td.white-space {
  white-space: normal !important;
}
</style>
<style lang="sass">
.my-sticky-header-table
  max-height: 500px

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px
</style>
