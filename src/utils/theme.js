import { usePreferredColorScheme, useStorage } from "@vueuse/core";
import { computed, watch } from "vue";

const themeSetting = useStorage("theme", "system");

watch(
    themeSetting,
    () => {
        // location.reload();
    },
)

const preferredColor = usePreferredColorScheme();

const theme = computed(() => {
    if(themeSetting.value === "system"){
        if (preferredColor.value === 'no-preference') {
            return 'dark';
        }
        return preferredColor.value;
    }
    return themeSetting.value
});

export { themeSetting, theme };
