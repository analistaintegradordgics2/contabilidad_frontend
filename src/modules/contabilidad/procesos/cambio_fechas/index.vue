<template>
  <q-page class="q-pa-lg">
    <q-form ref="form_cambio" class="row">
      <l-select
        col="2"
        v-model="filtros.fuente"
        option-value="id"
        option-label="nombre"
        label="Documento *"
        :options="fuentes"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="3"
        v-model="filtros.tipo_documento"
        option-value="id"
        option-label="tipo_nombre"
        label="Tipo de documento *"
        :options="tipos_documentos"
        :rules="[$rules.required($t('validator.required'))]"
        :disable="tipos_documentos.length == 0"
      />
      <l-select
        col="2"
        v-model="filtros.mes"
        option-value="id"
        option-label="nombre"
        label="Mes *"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <div class="q-mt-xs q-ml-sm">
        <q-btn unelevated round dense color="primary" icon="search" @click="getDocumentos">
          <q-tooltip>Buscar</q-tooltip>
        </q-btn>
      </div>
      <q-space />
      <q-chip class="botones_acciones q-ma-none q-ml-md" size="22px">
        <div class="row q-col-gutter-x-md">
          <can
            class="col"
            permiso="view_menu_contabilidad_procesos_cambio_fecha"
          >
            <q-btn
              class="btnAcciones"
              round
              dense
              unelevated
              color="white"
              @click="cambiarFecha"
              :disable="data.filter((f) => f.select == true) == 0"
            >
              <q-icon name="mdi-calendar-edit" style="color: #42a5f5" />
              <q-tooltip>Cambiar Fecha</q-tooltip>
            </q-btn>
          </can>
          <div class="col">
            <q-btn class="btnAcciones" round dense unelevated color="white" @click="verBitacora">
              <q-icon name="fact_check" style="color: #42a5f5" />
              <q-tooltip>Bitácora</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-chip>
    </q-form>
    <div class="row">
      <q-space />
      <l-input col="3 q-mt-md" v-model="filtros.filter" placeholder="Búsqueda" />
      <div class="col-12">
        <q-table
          flat
          bordered
          row-key="name"
          :data="data"
          :columns="columns"
          :pagination.sync="pagination"
          :filter="filtros.filter"
        >
          <template v-slot:header-cell-select="props">
            <q-th :props="props">
              <q-checkbox v-model="selectall" color="amber" :disable="data.length == 0" />
            </q-th>
          </template>
          <template v-slot:body-cell-select="props">
            <q-td :props="props">
              <q-checkbox v-model="props.row.select" color="amber" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <l-bitacoraprocesoscontables ref="bitacoraprocesoscontables" :descargar="true" />
    <l-newmodal ref="modal_cambio_fecha" :validar_salir="false" titulo="Cambiar de fecha" footer>
      <template slot="body">
        <q-form ref="form_submit" class="row q-pa-md">
          <l-date
            :col="filtros.fuente == 4 ? '6' : '12'"
            label="Nueva fecha *"
            v-model="nueva_fecha"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <l-date
            col="6"
            label="Nueva fecha de vencimiento *"
            v-model="nueva_fecha_vencimiento"
            :rules="[$rules.required($t('validator.required'))]"
            v-if="filtros.fuente == 4"
          />
        </q-form>
      </template>
      <template slot="footer">
        <div class="row justify-center">
          <div class="col-3">
            <q-btn class="full-width" rounded color="amber" label="Guardar" @click="onSubmit" />
          </div>
        </div>
      </template>
    </l-newmodal>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  name: "index",
  layout: "main",
  data() {
    return {
      data: [],
      fuentes: [],
      tipos_documentos: [],
      filtros: {
        fuente: null,
        tipo_documento: null,
        mes: null,
        filter: null
      },
      mes_select: null,
      nueva_fecha: null,
      nueva_fecha_vencimiento: null,
      pagination: {
        rowsPerPage: 10
      },
      columns: [
        {
          name: "select",
          align: "center"
        },
        {
          name: "numero",
          align: "left",
          label: "Número",
          field: "numero",
          sortable: true
        },
        {
          name: "fecha",
          align: "left",
          label: "Fecha",
          field: "fecha",
          sortable: true
        },
        {
          name: "fechaven",
          align: "left",
          label: "Fecha Vencimiento",
          field: "fechaven",
          sortable: true,
        },
        {
          name: "nit",
          align: "left",
          label: "Nit",
          field: "nit"
        },
        {
          name: "nombre",
          align: "left",
          label: "Nombre",
          field: "nombre"
        },
        {
          name: "estado",
          align: "left",
          label: "Estado",
          field: "estado"
        }
      ],
      is_superuser: this.$store.getters["auth/user"].is_superuser
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
    selectall: {
      get() {
        if (this.data.length > 0) {
          if (
            this.data.length == this.data.filter(f => f.select == true).length
          ) {
            return true;
          }
        }
        return false;
      },
      set(val) {
        this.data.forEach(element => {
          element.select = val;
        });
      }
    }
  },
  methods: {
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    async onSubmit() {
      const validate = await this.$refs.form_submit.validate();
      if (validate) {
        let nueva_fecha_mes = moment(this.nueva_fecha, ["DD/MM/YYYY", "DD-MM-YYYY"]).format("MM");
        let nueva_fecha_anio = moment(this.nueva_fecha, ["DD/MM/YYYY", "DD-MM-YYYY"]).format("YYYY");
        let nueva_fecha_vencimiento = moment(this.nueva_fecha_vencimiento, ["DD/MM/YYYY", "DD-MM-YYYY"]).format("MM");
        let mes_select = this.meses.filter((f) => f.id == this.mes_select)[0].numero;
        
        if (this.is_superuser != true) {
          if ((Number(nueva_fecha_anio) != moment().year() || Number(nueva_fecha_mes) != (moment().month()+1))){
            this.LInfo(
              "warning",
              "La nueva fecha debe estar dentro del año y el mes en curso"
            );
            return
          }
        }
        if (nueva_fecha_mes == mes_select || this.is_superuser === true) {
          if (this.filtros.fuente == 4) {
            nueva_fecha_mes = moment(this.nueva_fecha, ["DD/MM/YYYY", "DD-MM-YYYY"]).format("YYYY-MM-DD");
            nueva_fecha_vencimiento = moment(this.nueva_fecha_vencimiento, ["DD/MM/YYYY", "DD-MM-YYYY"]).format("MM");
            if (parseInt(nueva_fecha_vencimiento) < parseInt(mes_select) && this.is_superuser === false) {
              this.LInfo(
                "warning",
                "La fecha de vencimiento debe ser mayor o igual al mes consultado."
                );
                return;
            } else {
              nueva_fecha_vencimiento = moment(this.nueva_fecha_vencimiento, ["DD/MM/YYYY", "DD-MM-YYYY"]).format("YYYY-MM-DD");
              if (nueva_fecha_vencimiento < nueva_fecha_mes) {
                this.LInfo("warning", "La fecha de vencimiento no puede ser menor a la nueva fecha.");
                return;
              }
            }
          }
          this.LConfim("¿Está seguro de cambiar la fecha de los documentos?", async () => {
            let array_ids = [];
            this.data
              .filter((f) => f.select == true)
              .forEach((element) => {
                array_ids.push(element.id);
              });
            let params = {
              data: array_ids,
              nueva_fecha: this.nueva_fecha,
              nueva_fecha_vencimiento: this.nueva_fecha_vencimiento,
            };
            await this.Post("contabilidad/documentos/cambio_fecha", params).then(
              (resp) => {
                this.LInfo("success", "Fecha modificada correctamente.");
                this.$refs.modal_cambio_fecha.close();
                this.data = [];
                this.getDocumentos();
              }
            );
          }, () => {});
        } else {
          this.LInfo(
            "warning",
            "La nueva fecha debe estar dentro del mes consultado."
          );
        }
      }
    },
    cambiarFecha() {
      this.nueva_fecha = null;
      this.$refs.modal_cambio_fecha.open();
    },
    async verBitacora() {
      await this.Get("contabilidad/documentos/bitacora_cambio_fecha").then(
        resp => {
          this.$refs.bitacoraprocesoscontables.abrirModal(resp);
        }
      );
    },
    async getFuentes() {
      await this.Get("contabilidad/fuentes").then(resp => {
        this.fuentes = resp;
      });
    },
    async getTipoDocumento(fuente_id) {
      await this.Post("contabilidad/tiposdocumentos/filtro", {
        id: fuente_id
      }).then(resp => {
        this.tipos_documentos = resp.filter(f => f.estado.toLowerCase() == "activo");
      });
    },
    async getDocumentos() {
      const validate = await this.$refs.form_cambio.validate();
      if (validate) {
        await this.Get(
          "contabilidad/documentos/list_cambio_fecha",
          this.filtros
        ).then(resp => {
          this.data = resp;
        });
      }
    }
  },
  watch: {
    "filtros.fuente"(val) {
      if (val != null) {
        this.filtros.tipo_documento = null;
        this.getTipoDocumento(val);
      } else {
        this.filtros.tipo_documento = null;
        this.tipos_documentos = [];
      }
    },
    "filtros.mes"(val) {
      if (val != null) {
        this.mes_select = val;
      }
    }
  },
  created() {
    this.getFuentes();
    this.getConfMes();
  }
};
</script>

<style lang="scss">
.btnAcciones {
  border: 1px solid #42a5f5 !important;
  &:hover {
    color: #194880 !important;
    border: 1px solid #194880 !important;
    & i {
      color: #194880 !important;
    }
  }
}

.botones_acciones {
  border: 1px solid var(---ffffff);
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0%
    0% no-repeat padding-box !important;
}
</style>