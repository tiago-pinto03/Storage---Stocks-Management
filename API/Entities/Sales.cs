using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Sales
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid? Id { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public Product Product { get; set; }
        public Client Client { get; set; }
        public Employee Employee { get; set; }
    }
}