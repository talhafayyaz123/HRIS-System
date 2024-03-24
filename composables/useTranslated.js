import { computed } from "vue";
import { useI18n } from "vue-i18n";

export function useTranslatedColumns(columnConfig) {
  const { t } = useI18n();

  const columns = computed(() => {
    return columnConfig.map((column) => {
      return {
        ...column,
        label: t(column.label),
      };
    });
  });

  return {
    columns,
  };
}

export function useTranslatedBreadCrumbs(breadCrumbsConfig) {
  const { t } = useI18n();

  const items = computed(() => {
    return breadCrumbsConfig.map((item) => {
      return {
        ...item,
        text: t(item.text),
      };
    });
  });

  return {
    items,
  };
}

export function useTitle(titleConfig) {
  const { t } = useI18n();

  const title = computed(() => {
    return t(titleConfig);
  });

  return {
    title,
  };
}
