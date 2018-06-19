using System;
using System.Collections.Generic;
using Core.Common.Data.Models;
using Core.Common.Data.Interfaces;
using Core.Common.Utilities;

namespace DotNetCoreWebAppModels.Models
{
    public sealed class Invoice : BaseObjectWithState, IObjectWithState
    {
        public Invoice()
        {
            InvoiceLine = new HashSet<InvoiceLine>();
            Guid = StringUtils.GenerateLowercase32DigitsGuid();
            DateCreated = DateTime.Now;
            DateModified = DateCreated;
        }

        public long InvoiceId { get; set; }
        public long CustomerId { get; set; }
        public string InvoiceDate { get; set; }
        public string BillingAddress { get; set; }
        public string BillingCity { get; set; }
        public string BillingState { get; set; }
        public string BillingCountry { get; set; }
        public string BillingPostalCode { get; set; }
        public string Total { get; set; }

        public ICollection<InvoiceLine> InvoiceLine { get; set; }
        public Customer Customer { get; set; }
    }
}
