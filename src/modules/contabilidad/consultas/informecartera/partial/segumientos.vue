<template>
  <div>
    <q-table
      class="my-sticky-header-table qtablecon"
      :data="data_tabla"
      :columns="columnas"
      row-key="name"
      flat
      dense
      bordered
      :hide-bottom="true"
      :rows-per-page-options="[0]"
      :pagination.sync="pagination"
      :loading="loading"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th class="bg-primary text-center">Arrendatario </q-th>
          <q-th class="bg-primary text-center">Fecha</q-th>
          <q-th class="bg-primary text-center">Compromiso</q-th>
          <q-th class="bg-primary text-center">Fecha Compromiso</q-th>
        </q-tr>
      </template>

      <template  v-slot:body="props">
        <q-tr class="text-center" style="background-color: white !important">
          <q-td>
          {{ props.row.persona_nombre }}
          </q-td>

          <q-td>
            {{ props.row.fecha }}
          </q-td>

          <q-td>
            {{ props.row.compromiso }}
          </q-td>
          
          <q-td>
            {{ props.row.fecha_compormiso }}
          </q-td>
        </q-tr>
      </template>
    </q-table>


    <l-newmodal
    ref="modal"
    :validar_salir="false"
    :persistent="true"
    full
    :titulo="' Creacion de seguimiento'"
    footer
   >
    <template slot="body">
      <q-card-section class="q-pt-none">
          <div class="row q-mb-sm">
            <div class="col-6">
              <label for="arr" class="text-bold q-mr-sm"> Arrendatario: </label>
              <span id="arr">
               {{ model.persona_nombre }}
              </span>
            </div>

            <div class="col-6">
              <label for="fecha" class="text-bold q-mr-sm q-ml-lg">Fecha: </label>
              <span id="fecha">
               {{ model.fecha }}
              </span>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <q-input
                v-model="model.compromiso"
                dense
                type="textarea"
                label="compromiso"
                autogrow
             />
            </div>

            <div class="col-6">
              <div style="max-width: 300px" class="q-ml-auto">
                <q-input dense v-model="model.fecha_compromiso" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date :options="optionsFn" mask="YYYY-MM-DD" v-model="model.fecha_compromiso">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Seleccionar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

          </div>
        </q-card-section>   
        <q-separator />

    </template>
    <template slot="footer">

      <div class="row justify-center">
          <div class="col-4">
            <q-btn
              dense
              unelevated
              class="full-width btnGuardar"
              label="Registrar"
              type="buttom"
              @click="guardar_seguimiento"
            ></q-btn>
          </div>
        </div>  
    </template>
      
    </l-newmodal>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
export default {
  name: "segumientosCartera",
  components: {},
  data() {
    return {
      loading: false,
      data_tabla: [],
      modal: false,
      model:{
        persona_nombre: '',
        persona_id: '',
        fecha: moment().format("YYYY-MM-DD"),
        compromiso: '',
        fecha_compromiso: moment().format("YYYY-MM-DD")
      },
      
      add_campos: false,
      columnas:[
        {
            name: "persona_nombre",
            label: "ARRENDATARIO",
            align: "center",
            headerClasses: "bg-primary text-white",
            field: "persona_nombre",
        },
        {
            name: "fecha",
            label: "FECHA",
            align: "center",
            headerClasses: "bg-primary text-white",
            field: "fecha",
        },
        {
            name: "compromiso",
            label: "COMPROMISO",
            headerClasses: "bg-primary text-white",
            field: "compromiso",
        },
        {
            name: "fecha_compormiso",
            label: "FECHA COMPROMISO",
            headerClasses: "bg-primary text-white",
            field: "fecha_compormiso",
        },
      ],
      pagination: {
          rowsPerPage: 0,
      },
    };
  },
  methods: {
    ...mapActions("http", ["Post"]),
    async guardar_seguimiento(){
      try {
        let fechanew = moment(this.model.fecha_compromiso).format("YYYY-MM-DD")
        this.model.fecha_compromiso = fechanew
        
        setTimeout(async () => {
          const datos = await this.Post({ 
            api: "contabilidad/consultas/registrar_seguimiento",
            model: {'datos': this.model} 
          });

          if(datos){
            this.$emit('actualizar_tabla');
            this.$refs.modal.close()
          }
        }, 100);

      } catch (error) {
        console.error(error);
      }
    },
    abrir_modal(model = null){
      this.model.persona_id = model.id_persona;
      this.model.persona_nombre = model.nombre;
      this.$refs.modal.open()
    },
    carga_datos(datos){
      if(datos.length > 0){
        this.data_tabla = datos
        this.model.persona_nombre = datos[0].persona_nombre
        this.model.persona_id = datos[0].personas_id
      }
    },
    optionsFn (date) {
      return date > moment().format("YYYY-MM-DD")
    },
  },
};
</script>

<style>
</style>