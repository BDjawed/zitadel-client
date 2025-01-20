import { z } from 'zod'
import { DetailsSchema } from '../common'

export enum ZitadelThemeMode {
  UNSPECIFIED = 'THEME_MODE_UNSPECIFIED',
  AUTO = 'THEME_MODE_AUTO',
  DARK = 'THEME_MODE_DARK',
  LIGHT = 'THEME_MODE_LIGHT',
}

export const ZitadelLabelPolicyResponseSchema = z.object({
  policy: z.object({
    detail: DetailsSchema,
    primaryColor: z.string(),
    isDefault: z.boolean(),
    hideLoginNameSuffix: z.boolean(),
    warnColor: z.string(),
    backgroundColor: z.string(),
    fontColor: z.string(),
    primaryColorDark: z.string(),
    backgroundColorDark: z.string(),
    warnColorDark: z.string(),
    fontColorDark: z.string(),
    disableWatermark: z.boolean(),
    logoUrl: z.string().optional(),
    iconUrl: z.string().optional(),
    logoUrlDark: z.string().optional(),
    iconUrlDark: z.string().optional(),
    fontUrl: z.string().optional(),
    themeMode: z.nativeEnum(ZitadelThemeMode),
  }),
})

export type ZitadelLabelPolicyGetResponse = z.infer<typeof ZitadelLabelPolicyResponseSchema>
