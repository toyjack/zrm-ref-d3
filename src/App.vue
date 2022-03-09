<script setup>
import { ref } from "vue";
import routes from "./routes";

const ifNavMenu = ref(false);
</script>

 <template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar> -->
          図書寮本類聚名義抄注文引用の可視化
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab
          :label="route.name"
          :to="route.path"
          v-for="route of routes"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template> 


