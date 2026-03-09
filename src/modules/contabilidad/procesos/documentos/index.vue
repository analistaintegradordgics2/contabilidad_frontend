<template>
  <div>
    <div class="row q-pa-md" style="background:#F1F7FC">
      <div class="col-4">
        <q-radio
          v-model="model.tipodocumento"
          :val="1"
          label="Ingresos"
          @input="selectTipodocumento(1)"
        />
        <q-radio
          v-model="model.tipodocumento"
          :val="2"
          label="Egresos"
          @input="selectTipodocumento(2)"
        />
        <q-radio
          v-model="model.tipodocumento"
          :val="3"
          label="Notas contables"
          @input="selectTipodocumento(3)"
        />
        <q-radio
          v-model="model.tipodocumento"
          :val="4"
          label="Factura"
          @input="selectTipodocumento(4)"
        />
      </div>
      <div class="col-3">
        <l-select
          col="text-black"
          v-model="model.tipobusqueda"
          value="id"
          option-label="nombre"
          :options="tipodocumentofuente"
          label="Tipos de documentos"
          ref="selecttd"
          :rules="[true]"
        />
      </div>
      <div class="col-3">
        <l-input
          col="md-3 text-black search"
          v-model="model.documento"
          label="Numero de documento"
          placeholder="Para rango separar con ';'"
          :rules="[true]"
        />
      </div>
      <div class="col-2">
        <l-select
          col="3 text-black"
          v-model="model.usuario"
          value="id"
          option-label="n_completo"
          :options="usuarioslogeo"
          label="Usuario"
          ref="selectusu"
          :rules="[true]"
        />
      </div>
      <div class="row col-12">
        <div class="row col-4">
          <l-date col="md-6 text-black" v-model="model.finicio" label="Desde" colorico="primary" />
          <l-date col="md-6 text-black" v-model="model.ffin" label="Hasta" colorico="primary" />
        </div>
        <div class="row col-8">
          <div class="col-2 q-px-md">
            <q-checkbox
              class="text-black abiertos"
              v-model="model.estado"
              left-label
              :id="1"
              :val="1"
              label="Abiertos"
            />
          </div>
          <div class="col-2 q-px-md">
            <q-checkbox
              class="col-md-2 text-black anulados"
              v-model="model.estado"
              left-label
              :id="2"
              :val="3"
              label="Anulados"
            />
          </div>
          <div class="col-2 q-px-md">
            <q-checkbox
              class="col-md-2 text-black cerrados"
              v-model="model.estado"
              left-label
              :id="3"
              :val="2"
              label="Cerrados"
            />
          </div>
          <div class="col-md-2 q-px-md">
            <q-checkbox
              class="col-md-2 text-black reabiertos"
              v-model="model.estado"
              left-label
              size="sm"
              :id="4"
              :val="4"
              label="Reabiertos"
            />
          </div>
          <div class="col-2 q-px-md">
            <can permiso="view_menu_gestion_contable_gastos_administrativos_documentos_acciones_buscar_documentos">
              <q-btn dense glossy @click="buscarDocumento" class="btnfiltrar btngenerfiltrar">
                <span class="qbtn-label">Filtrar</span>
              </q-btn>
            </can>
          </div>
        </div>
      </div>
    </div>
    <div class="q-ml-lg q-mr-lg q-mt-lg">
      <div class="row">
        <div class="row col-12 flex items-center justify-end">
          <div class="col-4 q-px-md">
            <l-input col="text-black" v-model="filter" label="Buscar" :norequerido="true">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </l-input>
          </div>
          <div class="q-pa-sm divopciones">
            <can
              permiso="view_menu_gestion_contable_gastos_administrativos_documentos_acciones_imprimir_listado_documentos"
            >
              <q-btn
                round
                dense
                color="white"
                @click="imprimir_list_documentos(1)"
                class="q-mr-sm"
                :disable="listfilterdocumentos.length == 0"
              >
                <q-icon name="print" style="color:#42A5F5 !important" />
                <q-tooltip>Imprimir</q-tooltip>
              </q-btn>
            </can>
            <q-btn
              round
              dense
              color="white"
              @click="imprimir_list_documentos(2)"
              class="q-mr-sm"
              :disable="listfilterdocumentos.length == 0"
            >
              <q-icon name="print" color="blue" />
              <q-tooltip> Imprimir Documentos </q-tooltip>
            </q-btn>  
            <q-btn
              round
              dense
              class="q-mr-sm"
              color="white"
              @click="exportarexcel"
              v-if="listfilterdocumentos.length > 0"
            >
              <q-icon name="mdi-microsoft-excel" style="color:#42A5F5 !important" />
              <q-tooltip>Exportar</q-tooltip>
            </q-btn>
            <can :permiso="model.tipodocumento == 2 ? 'add_egreso' : 'view_menu_gestion_contable_gastos_administrativos_documentos_acciones_crear_documento'">
              <q-btn
                round
                dense
                style="background:#42A5F5 !important"
                @click="verdocumentos(null,model.tipodocumento,null,false)"
              >
                <q-icon name="add" color="white" />
                <q-tooltip>Nuevo documento</q-tooltip>
              </q-btn>
            </can>
          </div>
        </div>
      </div>
      <div class="q-mt-md">
        <q-table
          :data="listfilterdocumentos"
          :columns="columns"
          row-key="name"
          flat
          bordered
          :pagination.sync="pagination"
          :rows-per-page-options=[0]
        >
          <template v-slot:body="props">
            <q-tr style="position: relative">
              <q-td auto-width>
                <div
                  :class="
                      props.row.estado == 1
                        ? 'estadoabierto'
                        : props.row.estado == 3
                        ? 'estadoanulado'
                        : props.row.estado == 2
                        ? 'estadocerrado'
                        : props.row.estado == 4
                        ? 'estadoreabierto'
                        : ''
                    "
                ></div>
                <div class="row" style="width: 85px;">
                    <div class="col-6">
                      {{ props.row.tipodocumento.tipo }}
                    </div>
                    <div class="col-6">
                      <q-icon
                        name="mdi-cloud-sync"
                        size="20px"
                        color="primary"
                        v-if="props.row.cont_estadofact == 4"
                      >
                        <q-tooltip>Transmitida</q-tooltip>
                      </q-icon>
                    </div>
                  </div>
              </q-td>
              <q-td auto-width><q-badge v-if="props.row.auto" style="background: #06bc54;margin-right: 5px">{{ props.row.auto }}</q-badge>{{ props.row.numero }}</q-td>
              <q-td auto-width>{{ props.row.fechaf }}</q-td>
              <q-td auto-width>{{ props.row.persona.nombre }}</q-td>
              <q-td auto-width>{{ props.row.persona.documento }}</q-td>
              <q-td class="white-space" style="width: 30%">
                {{
                props.row.detalle
                }}
              </q-td>
              <q-td auto-width class="text-right">$ {{ props.row.totalt }}</q-td>
              <q-td auto-width class="text-center">
                <q-icon
                  name="attach_file"
                  color="orange"
                  size="xs"
                  v-if="props.row.archivos.length > 0"
                >
                  <q-tooltip>Con archivos</q-tooltip>
                </q-icon>
              </q-td>
              <q-td auto-width class="text-center">
                <div :class="`row q-col-gutter-x-${is_superuser ? 'md' : 'sm'}`">
                  <div class="col" v-if="is_superuser && props.row.estado != 4">
                    <q-btn dense unelevated icon="mdi-lock-open-variant" @click="reabrirDocumento(props.row)">
                      <q-tooltip>Reabrir documento</q-tooltip>
                    </q-btn>
                  </div>
                  <div class="col" v-if="is_superuser && (props.row.tipodocumento.fuente !== 4 || (props.row.cont_estadofact !== 4 && props.row.estado !== 3 && props.row.cont_estadofact !== 3))">
                    <q-btn
                      dense
                      unelevated
                      icon="mdi-cancel"
                      @click="anularDocumento(props.row)"
                    >
                      <q-tooltip>Anular documento</q-tooltip>
                    </q-btn>
                  </div>
                  <can class="col" permiso="view_menu_gestion_contable_gastos_administrativos_documentos_acciones_editar_documento">
                    <q-btn
                      dense
                      unelevated
                      icon="mdi-eye"
                      @click="verdocumentos(props.row.numero,props.row.tipodocumento.fuente,props.row.id,false)"
                    >
                      <q-tooltip>Ver Documento</q-tooltip>
                    </q-btn>
                  </can>
                </div>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:no-data>
            <div class="full-width flex justify-center items-center">
              <q-icon size="24px" name="mdi-alert" color="red" />
              <span class="q-ml-xs">Sin Datos Disponibles</span>
            </div>
          </template>
          <template v-slot:pagination="">
              Total de documentos: {{ model.pagination_max }} - Pagina {{ model.page }} /
              {{ pagesNumber }}
              <q-btn
                icon="first_page"
                color="grey-8"
                round
                dense
                flat
                @click="model.page = 1; GetDocumentos()"
                :disable="model.page == 1"
              />

              <q-btn
                icon="chevron_left"
                color="grey-8"
                round
                dense
                flat
                @click="back"
                :disable="model.page == 1"
              />

              <q-btn
                icon="chevron_right"
                color="grey-8"
                round
                dense
                flat
                @click="next"
              />

              <q-btn
                icon="last_page"
                color="grey-8"
                round
                dense
                flat
                @click="model.page = pagesNumber; GetDocumentos()"
                :disable="pagesNumber == model.page"
              />
            </template>
        </q-table>
      </div>
    </div>
    <!-- </div> -->
    <showtipodocumento ref="showtipodocumento" />
    <verdocumentos ref="verdocumentos" @reload="GetDocumentos()" />
    <imprimirtipodocumento ref="imprimirtipodocumento" />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import showtipodocumento from "./partial/form/show";
import verdocumentos from "./partial/crear";
import imprimirtipodocumento from "./partial/form/imprimir";
import fileDownload from "js-file-download";
import axios from "axios";
export default {
  layout: "main",
  name: "index",
  components: {
    showtipodocumento,
    imprimirtipodocumento,
    verdocumentos
  },
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      filter: "",
      pagination: {
        rowsPerPage: 10
      },
      tipo_electronica: [],
      model: {
        tipodocumento: 1,
        tipobusqueda: 0,
        documento: null,
        usuario: 0,
        finicio: moment()
          .startOf("year")
          .format("DD/MM/YYYY"),
        ffin: moment().format("DD/MM/YYYY"),
        estado: [1, 2, 3, 4],
        page: 1,
        pagination_max: 0,
      },
      data: [],
      // documentos: [],
      columns: [
        {
          name: "tipo",
          required: true,
          label: "Tipo",
          align: "left",
          sortable: true,
          field: "tipodocumento.tipo"
        },
        {
          name: "numero",
          label: "Número",
          align: "left",
          sortable: true,
          field: "numero"
        },
        {
          name: "fechaf",
          label: "Fecha",
          align: "left",
          sortable: true,
          field: "fechaf"
        },
        {
          name: "nombre",
          label: "Nombre",
          align: "center",
          sortable: true,
          field: "persona.nombre"
        },
        {
          name: "documento",
          label: "Documento",
          align: "center",
          sortable: true,
          field: "persona.documento"
        },
        {
          name: "detalle",
          label: "Detalle",
          align: "center",
          sortable: true,
          field: "detalle"
        },
        {
          name: "total",
          label: "Total",
          align: "center",
          sortable: true,
          field: "totalt"
        },
        {
          name: "archivos",
          align: "center",
          headerClasses: "bg-primary text-white"
        },
        {
          name: "acciones",
          label: "Acciones",
          align: "center"
        }
      ],
      pdfs: { path: null },
      is_superuser: this.$store.getters["auth/user"].is_superuser
    };
  },
  computed: {
    ...mapState("contabilidad", [
      "tipodocumentofuente",
      "listfilterdocumentos"
    ]),
    ...mapState("generales", ["usuarioslogeo"]),
    pagesNumber() {
      return Math.ceil(this.model.pagination_max / this.pagination.rowsPerPage);
    },
  },
  methods: {
    ...mapActions("contabilidad", ["getTipodocumentoFuente"]),
    ...mapActions("generales", ["getUsuariosLogeo"]),
    async exportarexcel() {

      await this.PostDownload(
        "contabilidad/documentos/exportarexcel",
        this.model
      ).then(resp => {
        fileDownload(resp, "documentos_contables.xlsx");
      });
    },
    verdocumentos(documento, tipo_documento, id_doc, editar) {
      this.$refs.verdocumentos.abrirmodal(
        documento,
        tipo_documento,
        id_doc,
        editar
      );
    },
    buscarDocumento() {
      this.GetDocumentos();
    },
    selectTipodocumento(tipo, inicio = true) {
      this.model.tipobusqueda = 0;
      this.getTipodocumentoFuente({ id: tipo, mostrar: true });
      if (inicio == true) {
        this.$store.commit("contabilidad/SET_LISTFILTERDOCUMENTOS", []);
        this.model.page = 1;
        this.model.pagination_max = 0;
      }
    },
    async GetDocumentos() {
      try {
        this.model["fi"] = moment(this.model.finicio, [
          "DD/MM/YYYY",
          "DD-MM-YYYY"
        ]).format("YYYY-MM-DD");
        this.model["ff"] = moment(this.model.ffin, [
          "DD/MM/YYYY",
          "DD-MM-YYYY"
        ]).format("YYYY-MM-DD");
        this.model.search = this.filter.toLowerCase();
        this.model.documento = this.model.documento != null ? this.model.documento.toUpperCase() : null;
        let data = await this.Post(`contabilidad/documentos/filtro/${this.model.page}`, this.model);

        
        // let filterResults = data.results.filter(e => {
          
        //   console.log("Detalle en minúsculas:", e.persona.documento); 
        //   console.log("Detalle en minúsculas - busqueda:", this.model.search); 
        //   return e.detalle.toLowerCase().includes(this.model.search);
          
        // })

        
        
        data.results.sort(function (a, b) {
          if (parseInt(a.doc_consecutivo) < parseInt(b.doc_consecutivo)) {
            return 1;
          }
          if (parseInt(a.doc_consecutivo) > parseInt(b.doc_consecutivo)) {
            return -1;
          }
          return 0;
        });
        this.model.pagination_max = data.count;
        this.$store.commit("contabilidad/SET_LISTFILTERDOCUMENTOS", data.results);
        sessionStorage.setItem("documentosfiltrados", JSON.stringify(data.results));
        sessionStorage.setItem("filtroaplicado", JSON.stringify(this.model));
        sessionStorage.setItem("primeraBusqueda", true);
      } catch ({ message }) {
        console.error(message);
      }
    },
    async next() {
      this.model.page += 1;
      this.GetDocumentos();
    },
    async back() {
      this.model.page -= 1;
      this.GetDocumentos();
    },
    // TODO: Renderizar PDF con PDFkit
    async imprimir_list_documentos(tipo) {
      let params = {
        tipo: tipo,
        filtros: this.model
      }
      await this.view_pdf("contabilidad/documentos/imprimir_list_documentos", "post", params).then((resp) => {
        if (resp != undefined) {
          this.pdfs.path = resp;
          this.$refs.imprimirtipodocumento.abrirmodal(this.pdfs);
        }
      });
    },
    async anularDocumento(doc) {
      // console.log(doc);
      // Se va anular el documento
      this.LConfimInput(
        "textarea",
        "warning",
        "Por favor, justifique la anulación del documento.",
        async (data) => {
          let params = {
            iddocumento: doc.id,
            estado: doc.estado,
            usuario: this.$store.getters["auth/user"].id,
            accion: 2,
            mensaje: data,
          };
          const resp = await this.Post("contabilidad/documentos/acciondocumento", params);
          if (resp[0][0] == null) {
            // Cerro el documento ok
            this.LFinish(
              "Proceso finalizado correctamente.",
              () => {
                this.GetDocumentos();
              },
              false
            );
          } else {
            this.LConfimOK(
              "warning",
              resp[0][0],
              () => {},
              false
            );
          }
        },
        () => {},
        false
      );
    },
    async reabrirDocumento(doc) {
      this.LConfim(`¿Está seguro de reabrir el documento #${doc.numero}?`, async () => {
        let params = {
          id: [doc.id],
          estado: 4
        };
        const resp = await this.Post("contabilidad/documentos/reabrir_documentos", params);
        this.LConfimOK(
          "warning",
          resp.msg,
          () => {
            if (resp.status === 200) {
              this.GetDocumentos();
            }
          },
          false
        );
      },
      () => {});
    }
  },
  watch: {
    filter(val) {
      this.GetDocumentos();
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.model.tipobusqueda == 0) {
        setTimeout(() => {
          this.$refs.selecttd.$children[0].inputValue = 0;
        }, 1000);
      }
      if (this.model.usuario == 0) {
        setTimeout(() => {
          this.$refs.selectusu.$children[0].inputValue = 0;
        }, 1000);
      }
    });
  },
  created() {
    this.getTipodocumentoFuente({ id: 1, mostrar: true });
    this.getUsuariosLogeo(true);
    if (sessionStorage.getItem("documentosfiltrados") != undefined) {
      this.$store.commit(
        "contabilidad/SET_LISTFILTERDOCUMENTOS",
        JSON.parse(sessionStorage.getItem("documentosfiltrados"))
      );
    }
    if (sessionStorage.getItem("filtroaplicado") != undefined) {
      let filtro = JSON.parse(sessionStorage.getItem("filtroaplicado"));
      Object.keys(filtro).forEach(i => {
        Object.keys(this.model).forEach(j => {
          if (i == j) {
            if (i == "tipodocumento") {
              this.selectTipodocumento(filtro[i], false);
            }
            this.model[j] = filtro[i];
          }
        });
      });
    }
    setTimeout(() => {
      if (sessionStorage.getItem("primeraBusqueda") == null) {
        this.GetDocumentos();
      }
    }, 500);
  }
};
</script>
<style scoped lang="scss">
/* label.q-field--with-bottom {
  padding-bottom: 5px !important;
} */
@mixin btniconhover($codeicon, $png: false) {
  &:hover {
    & .qbtn-label {
      position: relative;
      &::before {
        @if ($png) {
          content: url("~assets/iconos/cupon.svg");
          top: 3px;
        } @else {
          content: $codeicon;
          font-family: "Material Icons";
          font-size: 18px;
        }
        position: absolute;
        left: -25px;
      }
    }
  }
}

.btngenerfiltrar {
  @include btniconhover("\e429", false);
}

div.abiertos {
  /* margin: 3px;
  padding: 3px; */
  padding: 18px;
  width: 145px;
  height: 40px;
  background: #29c16040 0% 0% no-repeat padding-box;
  border: 1px solid #29c160;
  border-radius: 24px;
  opacity: 1;
}
.estadoabierto {
  width: 12px;
  position: absolute;
  background: #29c16040;
  left: 0;
  top: 0;
  height: 100%;
}
div.anulados {
  width: 145px;
  height: 40px;
  padding: 18px;
  background: #d8d8d840 0% 0% no-repeat padding-box;
  border: 1px solid #d8d8d8;
  border-radius: 24px;
  opacity: 1;
}
.estadoanulado {
  width: 12px;
  position: absolute;
  background: #d8d8d840;
  left: 0;
  top: 0;
  height: 100%;
}
div.cerrados {
  width: 145px;
  height: 40px;
  padding: 18px;
  background: #e2424240 0% 0% no-repeat padding-box;
  border: 1px solid #e24242;
  border-radius: 24px;
  opacity: 1;
}
.estadocerrado {
  width: 12px;
  position: absolute;
  background: #e2424240;
  left: 0;
  top: 0;
  height: 100%;
}
div.reabiertos {
  width: 145px;
  height: 40px;
  padding: 15px;
  background: #f5b21d40 0% 0% no-repeat padding-box;
  border: 1px solid #f5b21d;
  border-radius: 24px;
  opacity: 1;
}
.estadoreabierto {
  width: 12px;
  position: absolute;
  background: #f5b21d40;
  left: 0;
  top: 0;
  height: 100%;
}
.q-table td.white-space {
  white-space: normal !important;
  text-align: justify !important;
}
</style>
