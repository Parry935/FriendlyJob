using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Utility
{
    public static class OfferEnumerations
    {
        public enum LevelType {

            [Description("Junior")]
            Junior,

            [Description("Mid")]
            Mid,

            [Description("Senior")]
            Senior
        }

        public enum ContractsType
        {
            [Description("Umowa o pracę")]
            Permanent,

            [Description("B2B")]
            B2B,

            [Description("Umowa zlecenie")]
            Mandate,

            [Description("Umowa o pracę, B2B")]
            PermanentB2B,

            [Description("Umowa o pracę, B2B, Umowa zlecenie")]
            PermanentB2BMandate,

            [Description("Umowa o pracę, Umowa zlecenie")]
            PermanentMandate,

            [Description("B2B, Umowa zlecenie")]
            B2BMandate,

        }

        public enum TimeType
        {
            [Description("Pełny etat")]
            FullTime,

            [Description("1/2 etatu")]
            HalfTime,

            [Description("3/4 etatu")]
            ThreeQuarterTime
        }

        public enum LanguageType
        {
            [Description("A1")]
            A1,

            [Description("A2")]
            A2,

            [Description("B1")]
            B1,

            [Description("B2")]
            B2,

            [Description("C1")]
            C1,

            [Description("C2")]
            C2
        }

        public enum EducationType
        {
            [Description("Zawdowe")]
            Vocational,

            [Description("Inżynier/licencjat")]
            EngineerOrBachelor,

            [Description("Magister")]
            Master
        }

        
        public static readonly Dictionary<string, LevelType> LevelDictionary = new Dictionary<string, LevelType>() {
            { "JUNIOR", LevelType.Junior},
            { "MŁODSZY PROGRAMISTA", LevelType.Junior},
            { "MID", LevelType.Mid},
            { "REGULAR", LevelType.Mid},
            { "SENIOR", LevelType.Senior},
            { "STARSZY PROGRAMISTA", LevelType.Senior},
        };

        public static readonly Dictionary<string, TimeType> TimeDictionary = new Dictionary<string, TimeType>() {
            { "PEŁNY ETAT", TimeType.FullTime},
            { "PÓŁ ETATU", TimeType.HalfTime},
            { "1/2", TimeType.HalfTime},
            { "3/4", TimeType.ThreeQuarterTime}
        };

        public static readonly Dictionary<string, LanguageType> LanguageDictionary = new Dictionary<string, LanguageType>() {
            { "A1", LanguageType.A1},
            { "A2", LanguageType.A2},
            { "B1", LanguageType.B1},
            { "B2", LanguageType.B2},
            { "C1", LanguageType.C1},
            { "C2", LanguageType.C2}
        };

        public static readonly Dictionary<string, EducationType> EducationDictionary = new Dictionary<string, EducationType>() {
            { "ZAWODOWE", EducationType.Vocational},
            { "INŻYNIER/LICENCJAT", EducationType.EngineerOrBachelor},
            { "MAGISTER", EducationType.Master}
        };


        public static ContractsType? ConvertContractsToEnum(bool ContractP , bool ContractB, bool ContractM)
        {
            ContractsType? contractsType = null;

            if (ContractP == true && ContractB == true && ContractM == true)
                contractsType = ContractsType.PermanentB2BMandate;

            if (ContractP == true && ContractB == true && ContractM == false)
                contractsType = ContractsType.PermanentB2B;

            if (ContractP == true && ContractB == false && ContractM == false)
                contractsType = ContractsType.Permanent;

            if (ContractP == false && ContractB == true && ContractM == true)
                contractsType = ContractsType.B2BMandate;

            if (ContractP == false && ContractB == true && ContractM == false)
                contractsType = ContractsType.B2B;

            if (ContractP == false && ContractB == false && ContractM == true)
                contractsType = ContractsType.Mandate;

            if (ContractP == true && ContractB == false && ContractM == true)
                contractsType = ContractsType.PermanentMandate;

            return contractsType;
        }

        public static HashSet<ContractsType> ConvertFilterContractsToEnumList(bool ContractP, bool ContractB, bool ContractM)
        {
            var contractsType = new HashSet<ContractsType>();

            if (ContractP == true)
            {
                contractsType.Add(ContractsType.Permanent);
                contractsType.Add(ContractsType.PermanentB2B);
                contractsType.Add(ContractsType.PermanentB2BMandate);
                contractsType.Add(ContractsType.PermanentMandate);
            }

            if (ContractB == true)
            {
                contractsType.Add(ContractsType.B2B);
                contractsType.Add(ContractsType.PermanentB2B);
                contractsType.Add(ContractsType.PermanentB2BMandate);
                contractsType.Add(ContractsType.B2BMandate);
            }

            if (ContractM == true)
            {
                contractsType.Add(ContractsType.Mandate);
                contractsType.Add(ContractsType.B2BMandate);
                contractsType.Add(ContractsType.PermanentB2BMandate);
                contractsType.Add(ContractsType.PermanentMandate);
            }

            return contractsType;
        }

    }
}
